import { Injectable, Inject, forwardRef, BadRequestException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../entities/payment';
import { BlockedDate } from '../entities/blocked-date';
import { Booking } from '../entities/booking';
import { v4 as uuidv4 } from 'uuid';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { BookingsService } from '../bookings/bookings.service';
import * as crypto from 'crypto';
import { Order } from '../entities/order';
import { InternationalProduct } from '../entities/international-product';

import { sendEmail } from "../utils/email";
import {
  bridalHireEmail,
  bridalHireAdminEmail,
  internationalOrderEmail,
  internationalAdminEmail,
  specialOrderAdminEmail,
  specialOrderEmail
} from "../utils/emailTemplates";
import { SpecialOrder } from 'src/entities/special-order';


@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentsRepo: Repository<Payment>,
    @InjectRepository(BlockedDate) private blockedRepo: Repository<BlockedDate>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
     @InjectRepository(Order) private orderRepo: Repository<Order>,
       @InjectRepository(InternationalProduct) private internationalRepo: Repository<InternationalProduct>, 
       @InjectRepository(SpecialOrder) private specialOrderRepo: Repository<SpecialOrder>,

    @Inject(forwardRef(() => BookingsService)) private bookingsService: BookingsService,
  ) {}
async createCheckoutSession(dto: InitiatePaymentDto) {
    // 1) Create temp booking
    // 1) Generate txRef differently for each type
let txRef: string;

if (dto.type === 'bridal_hire') {
  // Create booking only for bridal hire
  const temp = await this.bookingsService.createTempBooking({
    firstName: dto.first_name,
    lastName: dto.last_name,
    email: dto.email,
    phoneNumber: dto.phoneNumber,
    bridalWigId: dto.meta?.wigId,
    amount: dto.amount,
    bookingDate: dto.meta?.bookingDate,
  });
  txRef = temp.txRef;
} else {
  // For international orders, just make a simple reference
  txRef = `tx_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}


    // 2) Save payment
    const payment = this.paymentsRepo.create({
      transactionId: txRef,
      amount: dto.amount,
      currency: dto.currency,
      status: 'pending',
      method: 'paychangu',
      type: dto.type,
      meta: dto.meta,
    });
    await this.paymentsRepo.save(payment);

 // inside createCheckoutSession(dto)
// Special orders
if (dto.type === 'special') {
  const meta = dto.meta || {};
  const total = Number(meta.totalAmount ?? (dto.amount * 2));
  const deposit = Number(dto.amount);

  const specialOrder = this.specialOrderRepo.create({
    texture: meta.texture,
    colour: meta.colour,
    length: meta.length,
    totalAmount: total,
    depositAmount: deposit,
    balanceAmount: Math.max(0, total - deposit),
    status: 'pending',
    txRef,
    deliveryWindowDays: 14,
    first_name: dto.first_name,
    last_name: dto.last_name,
    email: dto.email,
    phoneNumber: dto.phoneNumber,
    district: meta.district,
    user: dto.userId ? ({ id: dto.userId } as any) : undefined,
  });

  await this.specialOrderRepo.save(specialOrder);

  // ✅ Crucial: Link payment to this special order
  payment.specialOrder = specialOrder;
  payment.meta = { ...(payment.meta || {}), specialOrderId: specialOrder.id };
  await this.paymentsRepo.save(payment);
}

 
    // ✅ 2.5) If international order, create order record
if (dto.type === 'international') {
  // Safely extract meta
  const meta = dto.meta || {};

  if (!meta.productId) {
    throw new BadRequestException("productId is required for international orders");
  }
   
  // 1️⃣ Fetch the product entity
  const internationalProduct = await this.internationalRepo.findOne({
    where: { id: meta.productId },
  });

  if (!internationalProduct) {
    throw new NotFoundException("International product not found");
  }

  // 2️⃣ Create the order with full entity
  const order = this.orderRepo.create({
  totalAmount: dto.amount,   // full price
  depositAmount: dto.amount, // same as total
  balanceAmount: 0,          // no remaining balance
  status: 'pending',
  first_name: dto.first_name,
  last_name: dto.last_name,
  email: dto.email,
  phoneNumber: dto.phoneNumber,
  district: dto.meta?.district,

  product: internationalProduct,
});

  // 3️⃣ Save order and link to payment
  await this.orderRepo.save(order);
  payment.order = order;
  await this.paymentsRepo.save(payment);
}

    // 3) Block dates
    if (dto.type === 'bridal_hire' && dto.meta?.bookingDate) {
      const date = new Date(dto.meta.bookingDate);
      const offsets = [-1, 0, 1];
      for (const o of offsets) {
        const d = new Date(date);
        d.setDate(d.getDate() + o);
        const blocked = this.blockedRepo.create({
          date: d.toISOString().slice(0, 10),
          status: 'pending',
          txRef,
        });
        await this.blockedRepo.save(blocked);
      }
    }

    const headers = { Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`, Accept: 'application/json' };
    const body = {
      amount: String(dto.amount),
      currency: dto.currency,
      email: dto.email,
      first_name: dto.first_name,
      last_name: dto.last_name,
      callback_url: `${process.env.FRONTEND_RETURN_URL}?tx_ref=${txRef}&type=${dto.type}`,

      return_url: `${process.env.BACKEND_URL}/payments/redirect`,
      tx_ref: txRef,
      customization: { title: 'Curls Payment', description: dto.type === 'bridal_hire' ? 'Bridal hire booking' : 'International order' },
      meta: dto.meta || {},
      payment_methods: ['card','mobilemoney','banktransfer'],
    };

    const resp = await axios.post('https://api.paychangu.com/payment', body, { headers });
    const checkoutUrl = resp.data?.data?.checkout_url;

    return { checkout_url: checkoutUrl, tx_ref: txRef };
  }

async processWebhook(payload: any, headers: any) {
  console.log("🔔 Webhook received:", payload);

  const signature = headers["signature"] || headers["Signature"];
  const secret = process.env.PAYCHANGU_WEBHOOK_SECRET ?? "";

  if (!secret) throw new Error("Missing PAYCHANGU_WEBHOOK_SECRET");
  if (!signature) throw new Error("Missing signature header");

  // Validate signature
  const computed = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");

  if (computed !== signature) {
    console.log("❌ Signature mismatch");
    throw new Error("Invalid webhook signature");
  }

  console.log("✅ Signature verified");

  // PayChangu = `reference`
  const txRef = payload.reference;
  if (!txRef) throw new Error("Missing reference in webhook");

  // Fetch payment
  const payment = await this.paymentsRepo.findOne({
    where: { transactionId: txRef },
    relations: [
      "booking",
      "booking.bridalWig",
      "booking.bridalWig.product",
      "order",
      "order.product"
    ]
  });

  if (!payment) throw new Error("Payment not found: " + txRef);

  // ALWAYS verify with PayChangu
  const verifyResp = await axios.get(
    `https://api.paychangu.com/verify-payment/${txRef}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`
      }
    }
  );

  const data = verifyResp.data?.data;

  if (!data || data.status !== "success") {
    console.log("❌ FAILED verification", data);
    return { status: "failed" };
  }

  console.log("🎉 PAYMENT SUCCESS — Processing:", txRef);



  // Update payment status
  payment.status = "succeeded";
  await this.paymentsRepo.save(payment);

  // 🔗 ENSURE payment is linked to special order
if (payment.type === "special" && !payment.specialOrder) {
  const specialOrder = await this.specialOrderRepo.findOne({
    where: { txRef },
  });

  if (specialOrder) {
    payment.specialOrder = specialOrder;
    await this.paymentsRepo.save(payment);
  }
}

// 🔗 ENSURE payment is linked to international order
// 🔗 ENSURE payment is linked to international order
// 🔗 ENSURE payment is linked to international order
if (payment.type === "international" && !payment.order) {
  const paymentWithOrder = await this.paymentsRepo.findOne({
    where: { transactionId: txRef },
    relations: ["order"],
  });

  if (paymentWithOrder?.order) {
    payment.order = paymentWithOrder.order;
    await this.paymentsRepo.save(payment);
  }
}



  // 1️⃣ BRIDAL HIRE BOOKING
  // ---------------------------
  if (payment.type === "bridal_hire") {
    console.log("💍 Finalizing bridal hire booking...");

    await this.bookingsService.finalizeBooking({
      txRef,
      amount: Number(data.amount)
    });

    const booking = await this.bookingRepo.findOne({
      where: { txRef },
      relations: ["bridalWig"]
    });

    if (booking) {
      const wigImageUrl = `http://localhost:8080${booking.bridalWig?.imageUrl}`;
      await sendEmail(
        booking.email,
        "Booking Confirmed 🎉",
        bridalHireEmail(booking, wigImageUrl)
      );
      await sendEmail(
        process.env.ADMIN_EMAIL!,
        "New Booking Received",
        bridalHireAdminEmail(booking, wigImageUrl)
      );
    }
  }

  // ---------------------------
  // 2️⃣ SPECIAL ORDERS
  // ---------------------------
  if (payment.type === "special") {
    console.log("✨ Processing special order...");

    const specialOrder = await this.specialOrderRepo.findOne({
      where: { txRef }
    });

    if (specialOrder) {
      specialOrder.status = "processing";
      specialOrder.balanceAmount = Math.max(
        0,
        Number(specialOrder.totalAmount) - Number(data.amount)
      );
      if (specialOrder.balanceAmount === 0) specialOrder.status = "completed";

      await this.specialOrderRepo.save(specialOrder);

      await sendEmail(
        specialOrder.email!,
        "Special Order Received",
        specialOrderEmail(specialOrder, "http://localhost:8080/uploads/default.png")
      );

      await sendEmail(
        process.env.ADMIN_EMAIL!,
        "New Special Order",
        specialOrderAdminEmail(specialOrder, "http://localhost:8080/uploads/default.png")
      );
    }
  }

  // ---------------------------
  // 3️⃣ INTERNATIONAL ORDERS
  // ---------------------------
  if (payment.type === "international") {
    console.log("🌍 Processing international order...");

    const order = await this.orderRepo.findOne({
      where: { id: payment.order?.id },
      relations: ["product"]
    });

    if (order) {
      order.status = "processing";
      await this.orderRepo.save(order);

      // deactivate product
      if (order.product) {
        order.product.active = false;
        await this.internationalRepo.save(order.product);
      }

      const wigImageUrl = `http://localhost:8080${order.product?.imageUrl}`;
      const wigName = order.product?.wigName || "International Wig";

      await sendEmail(
        order.email,
        "Order Confirmed 🎉",
        internationalOrderEmail({ ...order, wigName }, wigImageUrl)
      );

      await sendEmail(
        process.env.ADMIN_EMAIL!,
        "New International Order Received",
        internationalAdminEmail({ ...order, wigName }, wigImageUrl)
      );
    }
  }

  return { status: "ok" };
}



async verifyPayment(txRef: string) {
  console.log("🚀 Starting payment verification for:", txRef);

  const payment = await this.paymentsRepo.findOne({
    where: { transactionId: txRef },
    relations: [
      'booking',
      'booking.bridalWig',
      'order',
      'order.product',
      'specialOrder',
    ],
  });

  if (!payment) {
    throw new NotFoundException("Payment not found");
  }

let order: Order | SpecialOrder | null = null;
let orderType: "normal" | "special" | null = null;

  if (payment.specialOrder) {
    order = payment.specialOrder;
    orderType = "special";
  } else if (payment.order) {
    order = payment.order;
    orderType = "normal";
  }

  console.log("🧾 PAYMENT:", payment.id);
  console.log("📦 ORDER TYPE:", orderType);
  console.log("📦 ORDER DATA:", order);

  // If webhook already processed
  if (payment.status === "succeeded") {
    return {
      paychangu_status: "success",
      order,
      orderType,
      note: "Already processed by webhook",
    };
  }

  // Verify with PayChangu
  let resp;
  try {
    resp = await axios.get(
      `https://api.paychangu.com/verify-payment/${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
        },
      }
    );
  } catch (err) {
    console.error("⚠️ PayChangu verification error");
    return { paychangu_status: "pending" };
  }

  const data = resp?.data?.data;
  if (!data) return { paychangu_status: "pending" };

  if (data.status !== "success") {
    return {
      paychangu_status: "failed",
      order: null,
      orderType: null,
    };
  }

  payment.status = "succeeded";
  await this.paymentsRepo.save(payment);

  return {
    paychangu_status: "success",
    order,
    orderType,
    note: "Marked succeeded. Webhook will finalize business logic.",
  };
}



// 1️⃣ Get all payments (for admin)
async getAllPayments() {
  return this.paymentsRepo.find({
    relations: ['booking', 'booking.bridalWig', 'booking.user', 'order', 'order.product', 'user'],
    order: { id: 'DESC' },
  });
}

// 2️⃣ Calculate total revenue from successful payments
async getTotalRevenue() {
  const result = await this.paymentsRepo
    .createQueryBuilder('payment')
    .select('SUM(payment.amount)', 'total')
    .where('payment.status = :status', { status: 'succeeded' })
    .getRawOne();

  return { totalRevenue: Number(result.total || 0) };
}

async getAdminSummary() {
  const payments = await this.paymentsRepo.find({
    relations: [
      'booking',
      'booking.bridalWig',
      'order',
      'order.product',
      'user'
    ],
    order: { id: 'DESC' }
  });

  const totalRevenue = payments
    .filter(p => p.status === "succeeded")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const bookings = await this.bookingRepo.find();
  const totalBookings = bookings.length;

  const orders = await this.orderRepo.find();
  const totalOrders = orders.length;

  const monthlyTotals = Array(12).fill(0);
  payments.forEach(p => {
    if (!p.createdAt) return;
    const month = new Date(p.createdAt).getMonth();
    monthlyTotals[month] += Number(p.amount || 0);
  });

  return {
    totalRevenue,
    totalBookings,
    totalOrders,
    monthlyTotals,
    recentPayments: payments.slice(0, 10)
  };
}

}
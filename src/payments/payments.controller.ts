import { Controller, Post, Body, Headers, Param, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initiate')
  initiatePayment(@Body() dto: InitiatePaymentDto) {
    return this.paymentsService.createCheckoutSession(dto);
  }

  @Post('webhook')
handleWebhook(@Body() payload: any, @Headers() headers: any) {
  console.log("🔥 PAYCHANGU WEBHOOK HIT");

  console.log("📨 Incoming Headers:", headers);
  console.log("📨 Incoming Body:", payload);

  return this.paymentsService.processWebhook(payload, headers);
}


   @Get('verify/:txRef')
   async verifyPayment(@Param('txRef') txRef: string) {
    return this.paymentsService.verifyPayment(txRef);
  }

 // 🔹 Admin: all payments
  @Get('admin/all')
  async getAllPayments() {
    return this.paymentsService.getAllPayments();
  }

  // 🔹 Admin: total revenue
  @Get('admin/total-revenue')
  async getTotalRevenue() {
    return this.paymentsService.getTotalRevenue();
  }

@Get("admin/summary")
async getSummary() {
  return this.paymentsService.getAdminSummary();
}

  
}

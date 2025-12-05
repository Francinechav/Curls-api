import { Booking } from "src/entities/booking";

// ----------------- Bridal Hire -----------------
export const bridalHireEmail = (booking: Booking, wigImageUrl: string) => `
  <h2>🎉 Your Booking is Confirmed!</h2>
  <p>Hi ${booking.firstName} ${booking.lastName},</p>
  <p>We’re excited to let you know that your booking for the wig <strong>${booking.bridalWig?.wigName || 'Unknown Wig'}</strong> is all set!</p>
  <img src="${wigImageUrl}" alt="${booking.bridalWig?.wigName || 'Wig'}" width="300"/>
  <p><strong>Booking Date:</strong> ${booking.bookingDate}</p>
  <p><strong>Amount Paid:</strong> MWK ${booking.amount}</p>
  <p><strong>Status:</strong> ${booking.status}</p>
  <p>Thanks for choosing us! We can’t wait to see you rocking your new look 💜</p>
`;

export const bridalHireAdminEmail = (booking: Booking, wigImageUrl: string) => `
  <h2>📢 New Booking Alert!</h2>
  <p>A new bridal hire booking has just come in:</p>
  <p><strong>Customer:</strong> ${booking.firstName} ${booking.lastName}</p>
  <p><strong>Wig:</strong> ${booking.bridalWig?.wigName || 'Unknown Wig'}</p>
  <img src="${wigImageUrl}" alt="${booking.bridalWig?.wigName || 'Wig'}" width="300"/>
  <p><strong>Date:</strong> ${booking.bookingDate}</p>
  <p><strong>Amount Paid:</strong> MWK ${booking.amount}</p>
  <p><strong>Status:</strong> ${booking.status}</p>
`;

// ----------------- International Orders -----------------
export const internationalOrderEmail = (order: any, wigImageUrl: string) => `
  <h2>🎉 Your Order is Received!</h2>
  <p>Hi ${order.first_name} ${order.last_name},</p>
  <p>We’ve received your order for the wig <strong>${order.product?.wigName || 'Unknown Wig'}</strong>. Thank you for shopping with us!</p>
  <img src="${wigImageUrl}" alt="${order.product?.wigName || 'Wig'}" width="300"/>
  <p><strong>Colour:</strong> ${order.product?.Colour || 'N/A'}</p>
  <p><strong>Length:</strong> ${order.product?.lengths?.join(", ") || 'N/A'} inches</p>
  <p><strong>Total Price:</strong> MWK ${order.totalAmount}</p>
  <p><strong>Deposit Paid:</strong> MWK ${order.depositAmount}</p>
  <p><strong>Balance Remaining:</strong> MWK ${order.balanceAmount}</p>
  <p><strong>Status:</strong> ${order.status}</p>
  <p>We’ll keep you updated as your order gets ready! 💜</p>
`;

export const internationalAdminEmail = (order: any, wigImageUrl: string) => `
  <h2>📢 New International Order!</h2>
  <p>A new order has just been received:</p>
  <p><strong>Customer:</strong> ${order.first_name} ${order.last_name}</p>
  <p><strong>Wig:</strong> ${order.product?.wigName || 'Unknown Wig'}</p>
  <img src="${wigImageUrl}" alt="${order.product?.wigName || 'Wig'}" width="300"/>
  <p><strong>Colour:</strong> ${order.product?.Colour || 'N/A'}</p>
  <p><strong>Length:</strong> ${order.product?.lengths?.join(", ") || 'N/A'} inches</p>
  <p><strong>Total Price:</strong> MWK ${order.totalAmount}</p>
  <p><strong>Deposit Paid:</strong> MWK ${order.depositAmount}</p>
  <p><strong>Balance Remaining:</strong> MWK ${order.balanceAmount}</p>
  <p><strong>Status:</strong> ${order.status}</p>
`;

// ----------------- Special Orders -----------------
export const specialOrderEmail = (order: any, imgUrl: string) => `
  <h2>🎉 Special Order Confirmation!</h2>
  <p>Hi ${order.first_name} ${order.last_name},</p>
  <p>Your special wig order has been received! We’re excited to craft something unique just for you.</p>
  <img src="${imgUrl}" alt="Special Order Wig" width="300"/>
  <p><strong>Texture:</strong> ${order.texture}</p>
  <p><strong>Colour:</strong> ${order.colour}</p>
  <p><strong>Length:</strong> ${order.length}</p>
  <p><strong>Total Price:</strong> MWK ${order.totalAmount}</p>
  <p><strong>Deposit Paid:</strong> MWK ${order.depositAmount}</p>
  <p><strong>Balance Remaining:</strong> MWK ${order.balanceAmount}</p>
  <p><strong>Status:</strong> ${order.status}</p>
  <p>Thank you for ordering with CINE PIXEL DESIGNS 💜 We’ll notify you once your wig is ready!</p>
`;

export const specialOrderAdminEmail = (order: any, imgUrl: string) => `
  <h2>📢 New Special Order Received!</h2>
  <p><strong>Customer:</strong> ${order.first_name} ${order.last_name}</p>
  <p><strong>Email:</strong> ${order.email}</p>
  <p><strong>Phone:</strong> ${order.phoneNumber}</p>
  <img src="${imgUrl}" alt="Special Order Wig" width="300"/>
  <p><strong>Texture:</strong> ${order.texture}</p>
  <p><strong>Colour:</strong> ${order.colour}</p>
  <p><strong>Length:</strong> ${order.length}</p>
  <p><strong>Total Price:</strong> MWK ${order.totalAmount}</p>
  <p><strong>Deposit:</strong> MWK ${order.depositAmount}</p>
  <p><strong>Balance:</strong> MWK ${order.balanceAmount}</p>
  <p><strong>Status:</strong> ${order.status}</p>
  <p>Let’s get this beauty ready for our customer! 💜</p>
`;

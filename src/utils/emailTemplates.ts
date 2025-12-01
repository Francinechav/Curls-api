import { Booking } from "src/entities/booking";

// Bridal Hire
export const bridalHireEmail = (booking: Booking, wigImageUrl: string) => `
  <h2>Booking Confirmation 🎉</h2>
  <p>Hi ${booking.firstName} ${booking.lastName},</p>
  <p>Your booking for the wig <strong>${booking.bridalWig?.wigName || 'Unknown Wig'}</strong> is confirmed!</p>
  <img src="${wigImageUrl}" alt="${booking.bridalWig?.wigName || 'Wig'}" width="300"/>
  <p><strong>Date:</strong> ${booking.bookingDate}</p>
  <p><strong>Amount Paid:</strong> MWK ${booking.amount}</p>
  <p><strong>Status:</strong> ${booking.status}</p>
  <p>Thank you for booking with us!</p>
`;

export const bridalHireAdminEmail = (booking: Booking, wigImageUrl: string) => `
  <h2>New Booking Received</h2>
  <p>Customer: ${booking.firstName} ${booking.lastName}</p>
  <p>Wig: ${booking.bridalWig?.wigName || 'Unknown Wig'}</p>
  <img src="${wigImageUrl}" alt="${booking.bridalWig?.wigName || 'Wig'}" width="300"/>
  <p>Date: ${booking.bookingDate}</p>
  <p>Amount Paid: MWK ${booking.amount}</p>
  <p>Status: ${booking.status}</p>
`;


// International Orders - Customer Email
export const internationalOrderEmail = (order: any, wigImageUrl: string) => `
  <h2>Order Confirmation 🎉</h2>
  <p>Hi ${order.first_name} ${order.last_name},</p>
  <p>Your order for the wig <strong>${order.product?.wigName || 'Unknown Wig'}</strong> is received!</p>
  <img src="${wigImageUrl}" alt="${order.product?.wigName}" width="300"/>
  <p><strong>Colour:</strong> ${order.product?.Colour || 'N/A'}</p>
  <p><strong>Length:</strong> ${order.product?.lengths?.join(", ") || 'N/A'} inches</p>
  <p><strong>Total Price:</strong> MWK ${order.totalAmount}</p>
  <p><strong>Deposit Paid:</strong> MWK ${order.depositAmount}</p>
  <p><strong>Balance Remaining:</strong> MWK ${order.balanceAmount}</p>
  <p>Status: ${order.status}</p>
`;

// International Orders - Admin Email
export const internationalAdminEmail = (order: any, wigImageUrl: string) => `
  <h2>New Order Received</h2>
  <p>Customer: ${order.first_name} ${order.last_name}</p>
  <p>Wig: ${order.product?.wigName || 'Unknown Wig'}</p>
  <img src="${wigImageUrl}" alt="${order.product?.wigName}" width="300"/>
  <p>Colour: ${order.product?.Colour || 'N/A'}</p>
  <p>Length: ${order.product?.lengths?.join(", ") || 'N/A'} inches</p>
  <p>Total Price: MWK ${order.totalAmount}</p>
  <p>Deposit Paid: MWK ${order.depositAmount}</p>
  <p>Balance Remaining: MWK ${order.balanceAmount}</p>
  <p>Status: ${order.status}</p>
`;

// Special Order - Customer Email
export const specialOrderEmail = (order: any, imgUrl: string) => `
  <h2>Special Order Confirmation 🎉</h2>
  <p>Hi ${order.first_name} ${order.last_name},</p>

  <p>Your special wig order has been received!</p>

  <img src="${imgUrl}" alt="Special Order Wig" width="300"/>

  <p><strong>Texture:</strong> ${order.texture}</p>
  <p><strong>Colour:</strong> ${order.colour}</p>
  <p><strong>Length:</strong> ${order.length}</p>

  <p><strong>Total Price:</strong> MWK ${order.totalAmount}</p>
  <p><strong>Deposit Paid:</strong> MWK ${order.depositAmount}</p>
  <p><strong>Balance Remaining:</strong> MWK ${order.balanceAmount}</p>

  <p>Status: ${order.status}</p>

  <p>Thank you for ordering with CINE PIXEL DESIGNS 💜</p>
`;

// Special Order - Admin Email
export const specialOrderAdminEmail = (order: any, imgUrl: string) => `
  <h2>New Special Order Received</h2>

  <p>Customer: ${order.first_name} ${order.last_name}</p>
  <p>Email: ${order.email}</p>
  <p>Phone: ${order.phoneNumber}</p>

  <img src="${imgUrl}" alt="Special Order Wig" width="300"/>

  <p><strong>Texture:</strong> ${order.texture}</p>
  <p><strong>Colour:</strong> ${order.colour}</p>
  <p><strong>Length:</strong> ${order.length}</p>

  <p>Total Price: MWK ${order.totalAmount}</p>
  <p>Deposit: MWK ${order.depositAmount}</p>
  <p>Balance: MWK ${order.balanceAmount}</p>

  <p>Status: ${order.status}</p>
`;


import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}
  

  @Post()
  createBooking(@Body() body: any) {
    return this.bookingsService.createTempBooking(body);
  }

  @Get('by-txref/:txRef')
  getBooking(@Param('txRef') txRef: string) {
    return this.bookingsService.getBookingByTxRef(txRef);
  }

  @Get('blocked/:wigId')
  getBlockedDates(@Param('wigId') wigId: number) {
    return this.bookingsService.getBlockedDatesForWig(Number(wigId));
  }

@Get('by-wig/:wigId')
async getByWig(@Param('wigId') wigId: number) {
  return this.bookingsService.findByWig(+wigId);
}

// Admin endpoint: get all bookings
@Get('admin/all')
getAllBookings() {
  return this.bookingsService.getAllBookings();
}

}

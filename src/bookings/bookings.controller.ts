import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

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

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin/all')
getAllBookings() {
  return this.bookingsService.getAllBookings();
}

}

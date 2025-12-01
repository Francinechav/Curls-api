import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { SpecialOrderService } from './special-orders.service';

@Controller('special-orders')
export class SpecialOrderController {
  constructor(private service: SpecialOrderService) {}


 @Get() // GET /special-orders
  getAll() {
    return this.service.findAll();
  }

  @Get('tx/:txRef')
  getByTxRef(@Param('txRef') txRef: string) {
    return this.service.findByTxRef(txRef);
  }

   @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.service.updateStatus(Number(id), status);
  }
}

import { Module, OnModuleInit  } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { SeederModule } from './seeds/seeder.module';
import { AdminSeederService } from './seeds/admin-seeder.service';

import { User } from './entities/user';
import { Booking } from './entities/booking';
import { Order } from './entities/order';
import { Payment } from './entities/payment';
import { Product } from './entities/product';
import { BlockedDate } from './entities/blocked-date';
import { BridalHireWig } from './entities/bridal-hire';
import { InternationalProduct } from './entities/international-product';

import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { BridalHireModule } from './bridal-hire/bridal-hire.module';
import { InternationalProductsModule } from './international-product/international-product.module';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';
import { ReportsModule } from './reports/reports.module';
import { ContactModule } from './contact/contact.module';
import { SpecialOrder } from './entities/special-order';
import { SpecialOrderModule } from './special-orders/special-orders.module';
import { Texture } from './entities/texture';
import { Setting } from './entities/setting';
import { PriceTier } from './entities/price-tier';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';

dotenv.config();

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Booking, Order, Payment, Product, BlockedDate, BridalHireWig, InternationalProduct, SpecialOrder, 
        Texture, Setting, PriceTier
      ],
      synchronize: true,
      ssl: {
    rejectUnauthorized: false, 
  },
    }),

    BookingsModule,
    PaymentsModule,
    BridalHireModule,
    InternationalProductsModule,
    ProductModule,

    SeederModule,
    OrdersModule,
   
    ReportsModule,
    ContactModule,
    SpecialOrderModule,
    AuthModule,
    UserModule,
    JwtModule
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly adminSeeder: AdminSeederService) {}

  async onModuleInit() {
    await this.adminSeeder.seedAdmin();
  }
}

import { Module } from '@nestjs/common';
import { SharedModule } from './utils/shared.module';
import { AdvertiserModule } from './advertiser/advertiser.module';

@Module({
  imports: [SharedModule, AdvertiserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AdvertiserService } from './advertiser.service';
import { AdvertiserController } from './advertiser.controller';
import { AdvertiserCronJob } from './advertiser.cronjob';
import { SharedModule } from 'src/utils/shared.module';

@Module({
  controllers: [AdvertiserController],
  providers: [AdvertiserService, AdvertiserCronJob],
  imports: [SharedModule],
})
export class AdvertiserModule {
  constructor(private readonly advertiserCronJob: AdvertiserCronJob) {
    this.advertiserCronJob.syncAdvertisers();
  }
}

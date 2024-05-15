import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { Model } from 'mongoose';
import { Advertiser } from 'src/schemas/advertiser.schema';

@Injectable()
export class AdvertiserCronJob {
  constructor(
    @InjectModel(Advertiser.name) private advertiserModel: Model<Advertiser>,
    private configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async run() {
    await this.syncAdvertisers(true);
  }

  async syncAdvertisers(forceSync: boolean = false) {
    const apiKey = await this.configService.get<string>('API_KEY');
    const flexOffersBaseUrl =
      await this.configService.get<string>('FLEXOFFERS_API');

    const advertisersInDB = await this.advertiserModel.find();
    if (advertisersInDB.length === 0 || forceSync) {
      let page = 1,
        isDone = false;
      const axiosClient = axios.create({
        baseURL: flexOffersBaseUrl,
        headers: {
          apiKey: apiKey,
          Accept: 'application/json',
        },
      });
      do {
        const response = await axiosClient.get('/advertisers', {
          params: {
            Page: page,
            pageSize: 500,
            ApplicationStatus: 'ALL',
            ProgramStatus: 'Approved',
          },
        });
        const advertisers = response.data.results;
        console.log({ advertisers: response.data });

        if (advertisers && advertisers.length > 0) {
          for (const advertiser of advertisers) {
            await this.advertiserModel.findOneAndUpdate(
              { advertiserId: advertiser.id },
              {
                advertiserId: advertiser.id,
                name: advertiser.name,
                domainUrl: advertiser.domainUrl,
                categoryIds: advertiser.categoryIds,
                categoryNames: advertiser.categoryNames,
                created: advertiser.created,
                programStatus: advertiser.programStatus,
                lastStatusUpdated: advertiser.lastStatusUpdated,
                applicationStatus: advertiser.applicationStatus,
                applicationStatusDate: advertiser.applicationStatusDate,
                applicationStatusId: advertiser.applicationStatusId,
                description: advertiser.description,
                payout: advertiser.payout,
                imageUrl: advertiser.imageUrl,
                country: advertiser.country,
                sevenDayEpc: advertiser.sevenDayEpc,
                threeMonthEpc: advertiser.threeMonthEpc,
                thirtyDayEpc: advertiser.thirtyDayEpc,
                productAdvertiser: advertiser.productAdvertiser,
                promotionalAdvertiser: advertiser.promotionalAdvertiser,
                allowsDeeplinking: advertiser.allowsDeeplinking,
                deeplinkURL: advertiser.deeplinkURL,
                flexLinks: advertiser.flexLinks,
                lastCommissionUpdated: advertiser.lastCommissionUpdated,
                networkRank: advertiser.networkRank,
                actions: advertiser.actions,
              },
              { upsert: true, new: true, setDefaultsOnInsert: true },
            );
          }
        }

        page++;

        if (advertisers && advertisers.length !== 500) {
          isDone = true;
        }
      } while (!isDone);
    }
  }
}

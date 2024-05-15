import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { dbOptionDefault } from './const';
import { ApiProperty } from '@nestjs/swagger';

export type AdvertiserDocument = HydratedDocument<Advertiser>;

@Schema(dbOptionDefault)
export class Advertiser {
  _id: string;

  @Prop({
    index: true,
  })
  advertiserId: number;

  @Prop({
    index: true,
  })
  name: string;

  @Prop()
  domainUrl: string;

  @Prop()
  categoryIds: string;

  @Prop()
  categoryNames: string;

  @Prop()
  created: Date;

  @Prop({
    index: true,
  })
  programStatus: string;

  @Prop()
  lastStatusUpdated: Date;

  @Prop({
    index: true,
  })
  applicationStatus: string;

  @Prop()
  applicationStatusDate: string;

  @Prop()
  applicationStatusId: number;

  @Prop()
  description: string;

  @Prop()
  payout: string;

  @Prop()
  imageUrl: string;

  @Prop()
  country: string;

  @Prop()
  sevenDayEpc: string;

  @Prop()
  thirtyDayEpc: string;

  @Prop()
  threeMonthEpc: string;

  @Prop()
  productAdvertiser: boolean;

  @Prop()
  promotionalAdvertiser: boolean;

  @Prop()
  allowsDeeplinking: boolean;

  @Prop()
  deeplinkURL: string;

  @Prop()
  flexLinks: boolean;

  @Prop()
  lastCommissionUpdated: string;

  @Prop()
  networkRank: string;

  @Prop()
  actions: mongoose.Schema.Types.Mixed;
}

export const AdvertiserSchema = SchemaFactory.createForClass(Advertiser);

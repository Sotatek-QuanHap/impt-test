import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Advertiser } from 'src/schemas/advertiser.schema';
import {
  GetListAdvertiserInputDTO,
  GetListAdvertiserResponseDTO,
} from './dto/advertiser.dto';

@Injectable()
export class AdvertiserService {
  constructor(
    @InjectModel(Advertiser.name) private advertiserModel: Model<Advertiser>,
  ) {}

  async getListAdvertiser(
    query: GetListAdvertiserInputDTO,
  ): Promise<GetListAdvertiserResponseDTO> {
    const {
      name,
      programStatus,
      applicationStatus,
      sortColumn,
      sortOrder,
      pageSize,
      pageNumber,
    } = query;
    const filter = {} as any;
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (programStatus) {
      filter.programStatus = programStatus;
    }
    if (applicationStatus) {
      filter.applicationStatus = applicationStatus;
    }
    const advertisers = await this.advertiserModel
      .find({
        ...filter,
      })
      .sort({ [sortColumn]: sortOrder })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    const count = await this.advertiserModel.countDocuments({
      ...filter,
    });

    return { count, advertisers };
  }
}

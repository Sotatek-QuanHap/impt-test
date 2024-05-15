import { Controller, Get, Query } from '@nestjs/common';
import { AdvertiserService } from './advertiser.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GetListAdvertiserInputDTO,
  GetListAdvertiserResponseDTO,
} from './dto/advertiser.dto';

@Controller('advertiser')
@ApiTags('Advertiser')
export class AdvertiserController {
  constructor(private readonly advertiserService: AdvertiserService) {}

  @Get()
  @ApiOperation({ summary: 'Get list advertiser' })
  @ApiOkResponse({ type: GetListAdvertiserResponseDTO })
  async getListAdvertiser(
    @Query() query: GetListAdvertiserInputDTO,
  ): Promise<GetListAdvertiserResponseDTO> {
    return await this.advertiserService.getListAdvertiser(query);
  }
}

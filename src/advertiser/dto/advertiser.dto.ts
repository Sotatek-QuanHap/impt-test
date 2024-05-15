import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Advertiser } from 'src/schemas/advertiser.schema';
import { ApplicationStatus, ProgramStatus, SortOrder } from 'src/utils/const';

export class GetListAdvertiserInputDTO {
  @ApiPropertyOptional({
    enum: ProgramStatus,
  })
  @IsOptional()
  programStatus: ProgramStatus;

  @ApiPropertyOptional({
    enum: ApplicationStatus,
  })
  @IsOptional()
  applicationStatus: string;

  @ApiPropertyOptional()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  sortOrder: SortOrder = SortOrder.ASC;

  @ApiPropertyOptional()
  @IsOptional()
  sortColumn: string = 'name';

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  pageSize: number;

  @ApiProperty()
  @Min(1)
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  pageNumber: number;
}

export class GetListAdvertiserResponseDTO {
  @ApiProperty()
  count: number;

  @ApiProperty({
    type: [Advertiser],
  })
  advertisers: Advertiser[];
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Advertiser, AdvertiserSchema } from 'src/schemas/advertiser.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get('DB_USER');
        const password = configService.get('DB_PASS');
        const database = configService.get('DB_NAME');
        const host = configService.get('DB_HOST');
        const port = configService.get('DB_PORT');

        if (!username) {
          return {
            uri: `mongodb://${host}:${port}/${database}?directConnection=true`,
            dbName: database,
          };
        }
        return {
          uri: `mongodb://${username}:${password}@${host}:${port}/${database}?directConnection=true&authSource=admin&retryWrites=false&w=majority`,
          dbName: database,
        };
      },
    }),
    MongooseModule.forFeature([
      { name: Advertiser.name, schema: AdvertiserSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [MongooseModule, ConfigModule],
})
export class SharedModule {}

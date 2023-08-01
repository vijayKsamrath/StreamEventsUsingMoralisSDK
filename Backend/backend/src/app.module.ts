import { Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { RedisModule } from 'nestjs-redis';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/PersonalDetails"),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ContactModule,
  ],
})
export class AppModule {}

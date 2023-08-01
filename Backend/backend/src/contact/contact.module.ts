import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactController } from './contact.controller';
import { EthereumService } from '../ethereum/ethereum.service';
import { Contact, ContactSchema } from './contact.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }])],
  controllers: [ContactController],
  providers: [EthereumService],
})
export class ContactModule {}

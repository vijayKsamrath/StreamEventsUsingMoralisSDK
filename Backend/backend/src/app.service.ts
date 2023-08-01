import { Injectable } from '@nestjs/common';
// import { Contact, ContactSchema } from './contact/contact.schema';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';

@Injectable()
export class AppService {
  // constructor(
  // @InjectModel(Contact.name) private readonly contactModel: Model<Contact>,
  // ) {}
  getHello(): string {
    return 'Hello World!';
  }
 
}

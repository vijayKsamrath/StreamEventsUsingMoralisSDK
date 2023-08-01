import { Controller, Post, Body, Get, Inject, Res } from '@nestjs/common';
import { EthereumService } from '../ethereum/ethereum.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './contact.schema';

@Controller('contact')
export class ContactController {
  mongoConnection: any;
  cacheService: any;
  constructor(
    private ethereumService: EthereumService,
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {
    this.ethereumService
      .getContactAddedEvent()
      .subscribe(async (contactInfo) => {
        try {
          console.log(
            'contact info.............................:',
            contactInfo.name,
          );
          // Create a new Contact document and save it to the MongoDB collection
          const contact = new this.contactModel({
            name: contactInfo.name,
            phoneNumber: contactInfo.phoneNumber,
            email: contactInfo.email,
            date: contactInfo.date,
          });
          await contact.save();
          console.log('Contact Added:', contactInfo);
        } catch (error) {
          console.error('Error storing contact:', error);
        }
      });
  }

  // @Post()
  // async addcontact(@Res() response, @Body() contact: Contact) {
  //   console.log("new...........", contact)
  //       await this.ethereumService.addContact(contact.name, contact.email, contact.phoneNumber);
  //   const newContact = new this.contactModel(contact);
  //   newContact.save();
  //   return response.status(200).json({
  //     name: "abcd"
  // })
  // }

  @Post()
  async addContact(
    @Res() response,
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('phoneNumber') phoneNumber: string,
  ): Promise<void> {
    await this.ethereumService.addContact(name, email, phoneNumber);
    await this.cacheService.del('contacts');
  }

  @Get()
  async getNumberOfContacts(): Promise<number> {
    return this.ethereumService.getNumberOfContacts();
  }

  @Get('/:index')
  async getContactDetails(
    index: number,
  ): Promise<{ name: string; email: string; phoneNumber: string }> {
    const cachedContacts = await this.cacheService.get('contacts');
    if (cachedContacts) {
      const contacts = JSON.parse(cachedContacts);
      if (index >= 0 && index < contacts.length) {
        return contacts[index];
      }
    }
  }
}

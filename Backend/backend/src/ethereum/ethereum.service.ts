import { Injectable } from '@nestjs/common';
import { ethers, Contract, Wallet, providers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { Contact } from '../contact/contact.schema';
import * as abi from '../../abi.json';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { Subject } from 'rxjs'; // Import RxJS Subject

const contractAddress = process.env.CONTRACT_ADDRESS;

@Injectable()
export class EthereumService {
  private providers: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;
  private contractAddress;
  private signer: ethers.Wallet;
  private contactAddedEvent:  Subject<Contact> = new Subject<Contact>();

  constructor(private readonly configService: ConfigService) {
    Moralis.start({
      apiKey: this.configService.get('MORALIS_KEY'),
    });
    this.contractAddress = this.configService.get('CONTRACT_ADDRESS');
    this.providers = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    this.contract = new ethers.Contract(
      this.contractAddress,
      abi,
      this.providers,
    );
    
    // Get the private key from the environment or your secure storage
    const privateKey = process.env.PRIVATE_KEY; // Replace with your private key
    this.signer = new ethers.Wallet(privateKey, this.providers);

    this.test();
  }

  async test() {
    const options = {
      chains: [EvmChain.SEPOLIA],
      description: "Add contact Details",
      tag: "Contact",
      includeContractLogs: true,
      abi: abi,
      topic0: ["ContactAdded(address, string, string, string)"],
      webhookUrl: "https://webhook.site/659ee872-2454-4dae-b7b2-ea1533c3a7d5",
    };
    const stream = await Moralis.Streams.add(options);
    const { id } = stream.toJSON();

    await Moralis.Streams.addAddress({
      id: id,
      address: ['0x0163f8d399EDe5cF3a8af8c742D9e861A5aF50ae'],
    });

    this.contract.on('ContactAdded', (address: string, name: string, email: string, phoneNumber: string) => {
      const contact = new Contact();
      contact.name = name;
      contact.email = email;
      contact.phoneNumber = phoneNumber;
      contact.date = new Date();

      this.contactAddedEvent.next(contact);
    });
  }

  async addContact(
    name: string,
    email: string,
    phoneNumber: string,
  ): Promise<void> {
    // Call the 'addContact' function of the smart contract
    const tx = await this.signer.sendTransaction({
      to: this.contractAddress,
      data: this.contract.interface.encodeFunctionData('addContact', [name, email, phoneNumber]),
    });
    await tx.wait();
  }

  async getNumberOfContacts(): Promise<number> {
    // Call the smart contract function to get the number of stored contacts
    const numberOfContacts = await this.contract.getNumberOfContacts();
    return numberOfContacts.toNumber();
  }

  async getContactDetails(index: number): Promise<{ name: string, email: string, phoneNumber: string }> {
    // Call the smart contract function to get contact details by index
    const contactDetails = await this.contract.getContactDetails(index);
    return {
      name: contactDetails[0],
      email: contactDetails[1],
      phoneNumber: contactDetails[2],
    };
  }

  getContactAddedEvent(): Subject<Contact> {
    return this.contactAddedEvent;
  }
}

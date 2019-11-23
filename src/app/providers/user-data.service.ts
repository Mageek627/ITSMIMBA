import { Injectable } from '@angular/core';

import { Account } from '../models/account';
import { Payment } from '../models/payment';
import { Amount } from '../models/amount';
import { Currency } from '../models/currency';
import { Transaction } from '../models/transaction';
import { Occurrence } from '../enums/occurrence.enum';
import { CurrencyType } from '../enums/currency-type.enum';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private listAccounts: Account[];
  private currentAvailableId = 39;

  constructor() {}

  public create_dummy_accounts(): void {
    // const dummyDate = new Date();
    const dolUSD = new Currency('USD', CurrencyType.Fiat);
    const ETH = new Currency('ETH', CurrencyType.Crypto);
    // const dummyAmount = new Amount(dolUSD, 12);
    // const dummyPayment = new Payment(1, 'test', dummyAmount, dummyDate, 2, 2, Occurrence.Monthly);
    // const dummyTransaction = new Transaction(1, dummyDate, dummyAmount, 12);

    const dummyMain = new Account(27, 'Main', dolUSD, [], []);
    const dummyMain2 = new Account(14, 'ETH', ETH, [], []);

    this.listAccounts = [dummyMain, dummyMain2];
  }

  public get_accounts() {
    return this.listAccounts;
  }

  public add_account(name: string, currency: Currency) {
    const newAccount = new Account(
      this.currentAvailableId,
      name,
      currency,
      [],
      []
    );
    this.currentAvailableId++;
    this.listAccounts.push(newAccount);
  }
}

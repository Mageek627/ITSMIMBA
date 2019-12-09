import { Injectable } from '@angular/core';
import { Keys } from 'src/data/keys';
import { CurrencyType } from '../enums/currency-type.enum';
import { Occurrence } from '../enums/occurrence.enum';
import { Account } from '../models/account';
import { Amount } from '../models/amount';
import { Currency } from '../models/currency';
import { Payment } from '../models/payment';
import { Transaction } from '../models/transaction';
import { UserData } from '../models/user-data';
import { StorageUtils } from '../utils/storage-utils';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userData: UserData;

  constructor() {}

  private async create_dummy_accounts() {
    const dummyDate = new Date();
    const dolUSD = new Currency('USD', CurrencyType.Fiat);
    const ETH = new Currency('ETH', CurrencyType.Crypto);
    const dummyAmount = new Amount(dolUSD, 12);
    const dummyPayment = new Payment(
      1,
      'test',
      dummyAmount,
      dummyDate,
      2,
      2,
      Occurrence.Monthly
    );
    const dummyTransaction = new Transaction(dummyDate, dummyAmount, 12);

    const dummyMain = new Account(
      'Main',
      dolUSD,
      [dummyPayment],
      [dummyTransaction]
    );
    const dummyMain2 = new Account('ETH', ETH, [], []);
    const EUR = new Currency('EUR', CurrencyType.Fiat);
    this.userData.accounts.push(dummyMain, dummyMain2);
    await StorageUtils.setJSON(Keys.USER_DATA, this.userData);
  }

  public get_accounts() {
    console.log(this.userData);
    return this.userData.accounts;
  }

  public async initDataFirst() {
    const EUR = new Currency('EUR', CurrencyType.Fiat);
    const newUser = new UserData(UserData.currentVersionNumber, [], EUR);
    await StorageUtils.setJSON(Keys.USER_DATA, newUser);
    this.userData = newUser;
    await this.create_dummy_accounts();
  }

  public async initData() {
    this.userData = await StorageUtils.getJSON(Keys.USER_DATA);
    if (this.userData.version !== UserData.currentVersionNumber) {
      // TODO:
      // - Create a 'convert' function from old versions to newest
      await this.initDataFirst();
    }
  }

  public async add_account(name: string, currency: Currency) {
    const newAccount = new Account(name, currency, [], []);
    const id = this.userData.accounts.length;
    this.userData.accounts.push(newAccount);
    await StorageUtils.setJSON(Keys.USER_DATA, this.userData);
    return id;
  }

  public async add_transaction(
    accountNumber: number,
    transaction: Transaction
  ) {
    this.userData.accounts[accountNumber].pastTransactions.push(transaction);
    await StorageUtils.setJSON(Keys.USER_DATA, this.userData);
  }
}

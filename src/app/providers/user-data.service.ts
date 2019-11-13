import { Injectable } from '@angular/core';

import { Account } from '../models/account';
import { Payment } from '../models/payment';
import { Amount } from '../models/amount';
import { Currency } from '../models/currency';
import { Transaction } from '../models/transaction';
import { FiatCode } from '../enums/fiat-code.enum';
import { Occurrence } from '../enums/occurrence.enum';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  constructor() {}

  // TODO
  public get_accounts(): Account[] {
    const dummyDate = new Date();
    const dolUSD = new Currency(FiatCode.USD, true);
    const dummyAmount = new Amount(dolUSD, 12);
    const dummyPayment = new Payment(1, 'test', dummyAmount, dummyDate, 2, 2, Occurrence.Monthly);
    const dummyTransaction = new Transaction(1, dummyDate, dummyAmount, 12);

    const dummyMain = new Account('main', dolUSD, [dummyPayment], [dummyTransaction]);

    return [dummyMain];
  }
}

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
  constructor() { }

  // TODO
  public get_accounts(): Account[] {
    const dummyDate = new Date();
    const dolUSD: Currency = { code: FiatCode.USD, isFiat: true };
    const dummyAmount: Amount = { currency: dolUSD, value: 12 };
    const dummyPayment: Payment = { id: 1,
                                  label: 'test',
                                  amount: dummyAmount,
                                  startDate: dummyDate,
                                  howMany: 2, // -1 if it never stops
                                  factor: 2,
                                  occurrence: Occurrence.Monthly };
    const dummyTransaction: Transaction = { id: 1, amount: dummyAmount, date: dummyDate, relevantValue: 12 };

    const dummyMain: Account = { activePayments: [dummyPayment], pastTransactions: [dummyTransaction] };

    return [dummyMain];
  }
}

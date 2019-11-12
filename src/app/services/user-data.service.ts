import { Injectable } from '@angular/core';

import { Account } from '../interfaces/account';
import { Payment } from '../interfaces/payment';
import { Amount } from '../interfaces/amount';
import { Currency } from '../interfaces/currency';
import { Transaction } from '../interfaces/transaction';
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
    const dolUSD: Currency = { code: FiatCode.USD, is_fiat: true };
    const dummyAmount: Amount = { currency: dolUSD, value: 12 };
    const dummyPayment: Payment = { id: 1,
                                  label: 'test',
                                  amount: dummyAmount,
                                  start_date: dummyDate,
                                  how_many: 2, // -1 if it never stops
                                  factor: 2,
                                  occurrence: Occurrence.Monthly };
    const dummyTransaction: Transaction = { id: 1, amount: dummyAmount, date: dummyDate, relevant_value: 12 };

    const dummyMain: Account = { active_payments: [dummyPayment], past_transactions: [dummyTransaction] };

    return [dummyMain];
  }
}

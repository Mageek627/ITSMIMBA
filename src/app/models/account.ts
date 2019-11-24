import { Currency } from './currency';
import { Payment } from './payment';
import { Transaction } from './transaction';

export class Account {
  constructor(
    public name: string,
    public currency: Currency,
    public activePayments: Payment[],
    public pastTransactions: Transaction[]
  ) {}
}

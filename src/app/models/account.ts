import { Payment } from './payment';
import { Transaction } from './transaction';
import { Currency } from './currency';

export class Account {
  constructor(
    public id: number,
    public label: string,
    public currency: Currency,
    public activePayments: Payment[],
    public pastTransactions: Transaction[]
  ) {}
}

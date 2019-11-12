import { Payment } from './payment';
import { Transaction } from './transaction';

export class Account {
  constructor(public activePayments: Payment[], public pastTransactions: Transaction[]) {}
}

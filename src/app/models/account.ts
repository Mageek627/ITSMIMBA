import { Payment } from './payment';
import { Transaction } from './transaction';

export class Account {
    activePayments: Payment[];
    pastTransactions: Transaction[];
}

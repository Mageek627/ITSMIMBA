import { Payment } from './payment';
import { Transaction } from './transaction';

export interface Account {
    active_payments: Payment[];
    past_transactions: Transaction[];
}

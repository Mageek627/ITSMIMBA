import { Amount } from './amount';

export class Transaction {
    id: number;
    date: Date;
    amount: Amount;
    relevantValue: number; // Value expressed in the currency of the account, on the date of the transaction
}

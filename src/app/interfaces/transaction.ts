import { Amount } from './amount';

export interface Transaction {
    id: number;
    date: Date;
    amount: Amount;
    relevant_value: number; // Value expressed in the currency of the account, on the date of the transaction
}

import { Amount } from './amount';

export class Transaction {
  constructor(
    public id: number,
    public date: Date,
    public amount: Amount,
    public relevantValue: number // Value expressed in the currency of the account, on the date of the transaction
  ) {}
}

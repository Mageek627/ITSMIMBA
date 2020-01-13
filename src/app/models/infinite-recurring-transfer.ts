import { QuantifiedOccurrence } from './quantified-occurrence';
import { Transfer } from './transfer';

export class InfiniteRecurringTransfer {
  constructor(
    public transfer: Transfer,
    public quantifiedOccurrence: QuantifiedOccurrence
  ) {}
}

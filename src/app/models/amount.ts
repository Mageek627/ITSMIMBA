import { Currency } from './currency';

export class Amount {
  constructor(
    public currency: Currency,
    public value: number // If positive, the amount is debited. Otherwise, it is credited.
  ) {}
}

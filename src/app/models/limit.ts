import Big from 'big.js';
import { QuantifiedOccurrence } from './quantified-occurrence';

export class Limit {
  constructor(
    public label: string,
    public quantifiedOccurrence: QuantifiedOccurrence,
    public from: number | null, // If null, asset is added/given/won from external
    public to: number | null, // If null, asset is spent/sold/lost to external
    public amountOrigin: Big | null, // Limited to decimal scale
    public amountDestination: Big | null, // Limited to decimal scale
    public limitedOrigin: boolean // If false, it's the destination asset that is limited
  ) {}
}

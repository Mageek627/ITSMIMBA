import Big from 'big.js';

export class Transfer {
  constructor(
    public label: string, // Not necessarily unique
    public from: number | null, // If null, asset is added/given/won from external
    public to: number | null, // If null, asset is spent/sold/lost to external
    public amountOrigin: Big | null, // Limited to decimal scale
    public amountDestination: Big | null, // Limited to decimal scale
    public timestampDeparture: number, // If the event happens on a day, then 00:00:00
    public delayForArrival: number,
    public id: number = 0 // Unique
  ) {}
}

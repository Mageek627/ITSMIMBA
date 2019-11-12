import { Amount } from './amount';
import { Occurrence } from '../enums/occurrence.enum';

// - Example: if factor==2 and occurrence=Monthly, the payment will happen every 2 months
// - A One-Time payment is encoded as Daily occurrence with factor==1 and how_many==1
// - A Weekly payment is encoded as Daily occurrence with factor==7
// - If a payment started on the 29th/30th/31st and the current month is shorter,
//   the payment will happen on the last day of the month
export class Payment {
  constructor(
    public id: number,
    public label: string,
    public amount: Amount,
    public startDate: Date,
    public howMany: number, // -1 if it never stops
    public factor: number,
    public occurrence: Occurrence
  ) {}
}

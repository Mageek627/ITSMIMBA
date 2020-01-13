import { Occurrence } from '../enums/occurrence.enum';

// - Example: if factor=2 and occurrence=Monthly, the event will happen every 2 months
// - An hourly event is encoded as an EverySecond occurrence with factor=3600
// - A weekly event is encoded as Daily occurrence with factor=7
// - If an event started on the 29th/30th/31st and the occurrence is Monthly or Yearly and
//   the current month is shorter, the event will happen on the last day of the month
// - If workingDaysOnly==true, the event will happen on the following working day
export class QuantifiedOccurrence {
  constructor(
    public factor: number, // >0
    public occurrence: Occurrence,
    public startTimestamp: number,
    public workingDaysOnly: boolean
  ) {}
}

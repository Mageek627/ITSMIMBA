import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Transfer } from '../models/transfer';

@Injectable({
  providedIn: 'root'
})
export class DateUtils {
  constructor(private datePipe: DatePipe) {}

  public static toTimestamp(d: Date): number {
    return Math.floor(d.getTime() / 1000);
  }

  public static now(): number {
    const d = new Date();
    return this.toTimestamp(d);
  }

  public static sortByTimestamp(arr: any[], accNumber: number): any[] {
    if (arr.length === 0) {
      return [];
    } else if (arr[0].hasOwnProperty('timestampDeparture')) {
      arr.sort((a: Transfer, b: Transfer) => {
        let x = a.timestampDeparture;
        let y = b.timestampDeparture;
        if (a.to === accNumber) {
          x += a.delayForArrival;
        }
        if (b.to === accNumber) {
          y += b.delayForArrival;
        }
        return x - y;
      });
    }
    return arr;
  }

  public static datesAreOnSameDay(first: Date | null, second: Date): boolean {
    if (first === null) {
      return false;
    }
    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  }

  public static addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  public static addYears(date: Date, years: number) {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }
  public static addMonths(date: Date, months: number) {
    const d = date.getDate();
    date.setMonth(date.getMonth() + months);
    if (date.getDate() !== d) {
      date.setDate(0);
    }
    return date;
  }

  public format(d: any): string {
    if (d instanceof Date) {
      const s =
        this.datePipe.transform(d, 'MMMM d, y') +
        ' at ' +
        this.datePipe.transform(d, 'h:mm a');
      return s ? s : '';
    } else if (typeof d === 'number') {
      return this.format(new Date(d * 1000));
    } else {
      return '';
    }
  }
}

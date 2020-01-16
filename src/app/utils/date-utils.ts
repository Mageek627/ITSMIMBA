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

  public static relevantDate(t: Transfer, n: number): Date {
    let relevantTimestamp = t.timestampDeparture;
    if (t.to === n) {
      relevantTimestamp += t.delayForArrival;
    }
    return new Date(relevantTimestamp * 1000);
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

  public static addSecondsSimple(date: Date, seconds: number): Date {
    return new Date((DateUtils.toTimestamp(date) + seconds) * 1000);
  }
  public static addDaysSimple(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  public static addMonthsSimple(date: Date, months: number): Date {
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

  public isHoliday(date: Date, holidays: Date[]): boolean {
    const day = date.getDay();
    const isSaturday = day === 6;
    const isSunday = day === 0;
    if (isSaturday || isSunday) {
      return true;
    }
    let flag = false;
    for (const h of holidays) {
      if (DateUtils.datesAreOnSameDay(date, h)) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  public addHolidays(
    date: Date,
    workingDaysOnly: boolean,
    holidays: Date[]
  ): Date {
    if (!workingDaysOnly) {
      return date;
    }
    while (this.isHoliday(date, holidays)) {
      date = DateUtils.addDaysSimple(date, 1);
    }
    return date;
  }
}

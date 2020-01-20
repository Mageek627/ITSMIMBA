import { FormControl } from '@angular/forms';
import Big from 'big.js';
import { Transfer } from '../models/transfer';

export class MathsUtils {
  constructor() {}

  public static safeBig(value: string | null): Big | null {
    if (value === null) {
      return null;
    }
    let safeValue: Big;
    try {
      safeValue = new Big(value);
    } catch (e) {
      safeValue = new Big(0);
    }
    if (safeValue.eq(-0)) {
      safeValue = safeValue.abs();
    }
    return safeValue;
  }

  public static relevantAmount(t: Transfer, n: number): Big | null {
    if (t.to === n) {
      return t.amountDestination;
    }
    if (t.from === n) {
      return t.amountOrigin ? t.amountOrigin.times(-1) : null;
    }
    return null;
  }

  public static positiveNumberValidator(c: FormControl): any {
    if (typeof c.value === 'number' && c.value > 0) {
      return null;
    } else if (
      c.value === parseInt(c.value, 10) + '' &&
      parseInt(c.value, 10) > 0
    ) {
      return null;
    } else {
      return { positiveNumber: { valid: false } };
    }
  }

  public static positive(b: Big): boolean {
    return b.cmp(0) === 1;
  }
  public static negative(b: Big): boolean {
    return b.cmp(0) === -1;
  }
}

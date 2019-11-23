import { CurrencyType } from '../enums/currency-type.enum';

export class Currency {
  constructor(public code: string, public currencyType: CurrencyType) {}
}

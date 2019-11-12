import { FiatCode } from '../enums/fiat-code.enum';
import { CryptoCode } from '../enums/crypto-code.enum';

export class Currency {
  constructor(public code: FiatCode | CryptoCode, public isFiat: boolean) {}
}

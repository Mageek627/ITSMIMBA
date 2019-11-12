import { FiatCode } from '../enums/fiat-code.enum';
import { CryptoCode } from '../enums/crypto-code.enum';

export class Currency {
    code: FiatCode | CryptoCode;
    isFiat: boolean;
}

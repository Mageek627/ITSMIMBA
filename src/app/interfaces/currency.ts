import { FiatCode } from '../enums/fiat-code.enum';
import { CryptoCode } from '../enums/crypto-code.enum';

export interface Currency {
    code: FiatCode | CryptoCode;
    is_fiat: boolean;
}

import { Currency } from './currency';

export class Amount {
    currency: Currency;
    value: number; // If positive, the amount is credited. Otherwise, it is debited.
}

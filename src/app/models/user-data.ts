import { Account } from './account';
import { Currency } from './currency';

export class UserData {
  constructor(public accounts: Account[], public preferredBase: Currency) {}
}

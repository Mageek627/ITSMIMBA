import { Account } from './account';
import { Currency } from './currency';

export class UserData {
  public static currentVersionNumber = 1;
  constructor(
    public version: number, // The version for the data format (in case it changes in future updates, for backward compatibility)
    public accounts: Account[],
    public preferredBase: Currency
  ) {}
}

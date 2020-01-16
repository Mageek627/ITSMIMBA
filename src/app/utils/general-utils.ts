import { Account } from './../models/account';

export class GeneralUtils {
  public static duplicateAccountName(
    name: string,
    accounts: Account[],
    except: string = ''
  ): boolean {
    for (const a of accounts) {
      if (name === a.name && a.name !== except) {
        return true;
      }
    }
    return false;
  }
}

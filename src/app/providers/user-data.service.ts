import { Injectable } from '@angular/core';
import { Big } from 'big.js';
import { Constants } from '../data/constants';
import { cryptoCatalogue } from '../data/crypto-catalogue';
import { fiatCatalogue } from '../data/fiat-catalogue';
import { Keys } from '../data/keys';
import { AssetType } from '../enums/asset-type.enum';
import { Account } from '../models/account';
import { AccountsGraph } from '../models/accounts-graph';
import { AssetDefinition } from '../models/asset-definition';
import { AssetReference } from '../models/asset-reference';
import { Data } from '../models/data';
import { Transfer } from '../models/transfer';
import { User } from '../models/user';
import { DateUtils } from '../utils/date-utils';
import { LogUtils } from '../utils/log-utils';
import { MathsUtils } from '../utils/maths-utils';
import { StorageUtils } from '../utils/storage-utils';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private data: Data;
  public assetCatalogue: AssetDefinition[][];

  constructor() {}

  private async create_dummy_accounts(): Promise<void> {
    const dummyA = new Account(
      'Test 1',
      new AssetReference(AssetType.Fiat, 'USD')
    );
    const dummyB = new Account(
      'Test 2',
      new AssetReference(AssetType.Crypto, 'ETH'),
      true,
      [new Transfer('Hey', null, 1, null, new Big('1.2'), DateUtils.now(), 0)]
    );
    const dummyG = new AccountsGraph([dummyA, dummyB], [], [], []);
    const dummyU = new User(new AssetReference(AssetType.Fiat, 'EUR'), dummyG);
    this.data = new Data(dummyU);
    await StorageUtils.setJSON(Keys.DATA, this.data);
  }

  get accounts(): Account[] {
    return this.data.user.accountsGraph.accounts;
  }

  get baseAsset(): AssetReference {
    return this.data.user.baseAsset;
  }

  get internalTransfers(): Transfer[] {
    return this.data.user.accountsGraph.internalTransfers;
  }

  public async initDataFirst(): Promise<void> {
    const newUser = new User(
      new AssetReference(AssetType.Fiat, Constants.baseCurrency)
    );
    const newData = new Data(newUser);
    await StorageUtils.setJSON(Keys.DATA, newData);
    this.assetCatalogue = [fiatCatalogue, cryptoCatalogue, [], [], []];
    await StorageUtils.setJSONUnsafe(Keys.ASSET_CATALOGUE, this.assetCatalogue);
    this.data = newData;
    await this.create_dummy_accounts();
  }

  private convertToBig(x: any): any {
    const b = (z: string) => MathsUtils.safeBig(z);
    for (const a of x.user.accountsGraph.accounts) {
      a.minimumAmount = b(a.minimumAmount);
      for (const e of a.externalTransfers) {
        e.amountOrigin = b(e.amountOrigin);
        e.amountDestination = b(e.amountDestination);
      }
      for (const e of a.externalLimits) {
        e.amountOrigin = b(e.amountOrigin);
        e.amountDestination = b(e.amountDestination);
      }
    }
    for (const i of x.user.accountsGraph.internalTransfers) {
      i.amountOrigin = b(i.amountOrigin);
      i.amountDestination = b(i.amountDestination);
    }
    for (const i of x.user.accountsGraph.internalLimits) {
      i.amountOrigin = b(i.amountOrigin);
      i.amountDestination = b(i.amountDestination);
    }
    for (const v of x.user.valuations) {
      for (const j of v) {
        j.value = b(j.value);
      }
    }
    for (const i of x.user.infiniteRecurringTransfers) {
      i.transfer.amountOrigin = b(i.transfer.amountOrigin);
      i.transfer.amountDestination = b(i.transfer.amountDestination);
    }
    return x;
  }

  public async initData(): Promise<void> {
    this.data = this.convertToBig(await StorageUtils.getJSON(Keys.DATA));
    this.assetCatalogue = await StorageUtils.getJSONUnsafe(
      Keys.ASSET_CATALOGUE
    );
    if (this.data.version !== Constants.currentVersionNumber) {
      // TODO:
      // - Create a 'convert' function from old versions to newest
      LogUtils.error('Data version different from current');
    }
  }

  public async createAccount(name: string, assetType: AssetType, code: string) {
    const newAccount = new Account(name, new AssetReference(assetType, code));
    const id = this.data.user.accountsGraph.accounts.length;
    this.data.user.accountsGraph.accounts.push(newAccount);
    await StorageUtils.setJSON(Keys.DATA, this.data);
    return id;
  }

  public async addTransfer(transfer: Transfer): Promise<void> {
    if (transfer.from === null && transfer.to !== null) {
      this.data.user.accountsGraph.accounts[transfer.to].externalTransfers.push(
        transfer
      );
    } else if (transfer.from !== null && transfer.to === null) {
      this.data.user.accountsGraph.accounts[
        transfer.from
      ].externalTransfers.push(transfer);
    } else if (transfer.from !== null && transfer.to !== null) {
      this.data.user.accountsGraph.internalTransfers.push(transfer);
    }
    await StorageUtils.setJSON(Keys.DATA, this.data);
  }

  // public async addPayment(
  //   accountNumber: number,
  //   payment: Payment2
  // ): Promise<void> {
  //   this.userData.accounts[accountNumber].activePayments.push(payment);
  //   await StorageUtils.setJSON(Keys.USER_DATA, this.userData);
  // }
}

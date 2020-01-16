import { Injectable } from '@angular/core';
import { Constants } from '../data/constants';
import { cryptoCatalogue } from '../data/crypto-catalogue';
import { fiatCatalogue } from '../data/fiat-catalogue';
import { Keys } from '../data/keys';
import { AssetType } from '../enums/asset-type.enum';
import { Account } from '../models/account';
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
      new AssetReference(AssetType.Fiat, 'USD'),
      '0',
      DateUtils.now()
    );
    const dummyB = new Account(
      'Test 2',
      new AssetReference(AssetType.Crypto, 'ETH'),
      '2',
      DateUtils.now()
    );
    this.data.user.accountsGraph.accounts.push(dummyA, dummyB);
    await StorageUtils.setJSON(Keys.DATA, this.data);
    await this.addTransfer(
      new Transfer('Hey', null, 1, null, new Big('1.2'), DateUtils.now(), 0)
    );
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
  get holidays(): Date[] {
    return this.data.user.holidays;
  }

  public async initDataFirst(): Promise<void> {
    const newUser = new User(
      new AssetReference(AssetType.Fiat, Constants.baseCurrency)
    );
    newUser.holidays = [new Date('2020-12-25'), new Date('2021-01-01')];
    const newData = new Data(newUser);
    this.assetCatalogue = [fiatCatalogue, cryptoCatalogue, [], [], []];
    this.data = newData;
    await this.saveAll();
    // await this.create_dummy_accounts();
  }

  public changeName(n: number, s: string) {
    this.data.user.accountsGraph.accounts[n].name = s;
    this.saveData();
  }

  public removeTransferNoSave(
    obj: { external: boolean; index: number },
    n: number
  ): void {
    if (obj.external) {
      console.log(this.data.user.accountsGraph.accounts[n].externalTransfers);
      this.data.user.accountsGraph.accounts[n].externalTransfers.splice(
        obj.index,
        1
      );
      console.log(this.data.user.accountsGraph.accounts[n].externalTransfers);
    } else {
      this.data.user.accountsGraph.internalTransfers.splice(obj.index, 1);
    }
  }

  public async addTransferSpecificPlace(
    obj: { external: boolean; index: number },
    n: number,
    t: Transfer
  ): Promise<void> {
    if (obj.external) {
      this.data.user.accountsGraph.accounts[n].externalTransfers.splice(
        obj.index,
        0,
        t
      );
    } else {
      this.data.user.accountsGraph.internalTransfers.splice(obj.index, 0, t);
    }
  }

  public async saveData(): Promise<void> {
    await StorageUtils.setJSON(Keys.DATA, this.data);
  }
  public async saveAll(): Promise<void> {
    await this.saveData();
    await StorageUtils.setJSONUnsafe(Keys.ASSET_CATALOGUE, this.assetCatalogue);
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
    for (let i = 0; i < x.user.holidays.length; i++) {
      x.user.holidays[i] = new Date(x.user.holidays[i]);
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

  public export(): string {
    return JSON.stringify([this.data, this.assetCatalogue]);
  }

  public async import(s: string): Promise<boolean> {
    try {
      const o = JSON.parse(s);
      this.data = this.convertToBig(o[0]);
      this.assetCatalogue = o[1];
      await this.saveAll();
      return true;
    } catch (e) {
      return false;
    }
  }

  public async createAccount(
    name: string,
    assetType: AssetType,
    code: string,
    initial: string
  ) {
    const newAccount = new Account(
      name,
      new AssetReference(assetType, code),
      initial,
      DateUtils.now()
    );
    const id = this.data.user.accountsGraph.accounts.length;
    this.data.user.accountsGraph.accounts.push(newAccount);
    await StorageUtils.setJSON(Keys.DATA, this.data);
    return id;
  }

  private del(i: number) {
    // TODO: a much much deeper analysis is needed for internal transfers/limits
    this.data.user.accountsGraph.accounts.splice(i, 1);
  }

  public deleteAccount(s: string) {
    let i = 0;
    for (; i < this.data.user.accountsGraph.accounts.length; i++) {
      if (this.data.user.accountsGraph.accounts[i].name === s) {
        break;
      }
    }
    if (i < this.data.user.accountsGraph.accounts.length) {
      this.del(i);
      this.saveData();
      return true;
    } else {
      return false;
    }
  }

  private addTransferNoSave(transfer: Transfer): void {
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
  }

  public async addTransfer(transfer: Transfer): Promise<void> {
    transfer.id = this.data.user.transfersUniqueId++;
    this.addTransferNoSave(transfer);
    await StorageUtils.setJSON(Keys.DATA, this.data);
  }

  public async addManyTransfers(arr: Transfer[]): Promise<void> {
    arr.forEach((x: Transfer) => {
      x.id = this.data.user.transfersUniqueId++;
      this.addTransferNoSave(x);
    });
    await StorageUtils.setJSON(Keys.DATA, this.data);
  }
}

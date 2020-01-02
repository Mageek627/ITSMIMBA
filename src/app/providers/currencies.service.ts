import { Injectable } from '@angular/core';
import { cryptocurrenciesData } from '../data/cryptocurrencies-data';
import { fiatCurrenciesData } from '../data/fiat-currencies-data';
import { Keys } from '../data/keys';
import { StorageUtils } from '../utils/storage-utils';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {
  private cryptoCurrencies: any;
  private fiatCurrencies: any;

  constructor() {}

  public async saveJSONLocal(): Promise<void> {
    this.cryptoCurrencies = cryptocurrenciesData;
    this.fiatCurrencies = fiatCurrenciesData;
    await StorageUtils.setJSONUnsafe(
      Keys.CRYPTOCURRENCIES_DATA,
      this.cryptoCurrencies
    );
    await StorageUtils.setJSONUnsafe(
      Keys.FIATCURRENCIES_DATA,
      this.fiatCurrencies
    );
  }

  public async loadLocal(): Promise<void> {
    this.cryptoCurrencies = await StorageUtils.getJSONUnsafe(
      Keys.CRYPTOCURRENCIES_DATA
    );
    this.fiatCurrencies = await StorageUtils.getJSONUnsafe(
      Keys.FIATCURRENCIES_DATA
    );
  }

  public get_fiat_currencies(): any {
    return this.fiatCurrencies;
  }

  public get_crypto_currencies(): any {
    return this.cryptoCurrencies;
  }
}

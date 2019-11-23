import { Injectable } from '@angular/core';

import { cryptocurrenciesData } from 'src/data/cryptocurrencies-data';
import { fiatCurrenciesData } from 'src/data/fiat-currencies-data';
import { StorageUtils } from '../utils/storage-utils';
import { Keys } from 'src/data/keys';

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
    await StorageUtils.set(
      Keys.CRYPTOCURRENCIES_DATA,
      JSON.stringify(this.cryptoCurrencies)
    );
    await StorageUtils.set(
      Keys.FIATCURRENCIES_DATA,
      JSON.stringify(this.fiatCurrencies)
    );
    return;
  }

  public async loadLocal() {
    this.cryptoCurrencies = JSON.parse(
      await StorageUtils.get(Keys.CRYPTOCURRENCIES_DATA)
    );
    this.fiatCurrencies = JSON.parse(
      await StorageUtils.get(Keys.FIATCURRENCIES_DATA)
    );
    return;
  }

  public get_fiat_currencies(): any {
    return this.fiatCurrencies;
  }

  public get_crypto_currencies(): any {
    return this.cryptoCurrencies;
  }
}

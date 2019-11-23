import { Injectable } from '@angular/core';

import { cryptocurrenciesData } from 'src/data/cryptocurrencies-data';
import { fiatCurrenciesData } from 'src/data/fiat-currencies-data';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {
  private cryptoCurrencies: any;
  private fiatCurrencies: any;

  // TODO
  constructor() {
    this.cryptoCurrencies = cryptocurrenciesData;
    this.fiatCurrencies = fiatCurrenciesData;
  }

  public get_fiat_currencies(): any {
    return this.fiatCurrencies;
  }

  public get_crypto_currencies(): any {
    return this.cryptoCurrencies;
  }
}

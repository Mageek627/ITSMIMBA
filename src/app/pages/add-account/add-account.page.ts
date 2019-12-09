import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CurrencyType } from 'src/app/enums/currency-type.enum';
import { Amount } from 'src/app/models/amount';
import { Currency } from 'src/app/models/currency';
import { Transaction } from 'src/app/models/transaction';
import { CurrenciesService } from 'src/app/providers/currencies.service';
import { NavigationStateService } from 'src/app/providers/navigation-state.service';
import { UserDataService } from 'src/app/providers/user-data.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.page.html',
  styleUrls: ['./add-account.page.scss']
})
export class AddAccountPage {
  public fiatCurrencies;
  public cryptoCurrencies;
  public currencyType = 'none';
  public nameOfAccount;
  public valueOfAccount;
  public cryptoChoice = '';
  public fiatChoice = '';

  constructor(
    private currenciesService: CurrenciesService,
    private userDataService: UserDataService,
    private navCtrl: NavController,
    private navigationStateService: NavigationStateService
  ) {
    this.fiatCurrencies = currenciesService.get_fiat_currencies().rates;
    this.cryptoCurrencies = currenciesService.get_crypto_currencies();
  }

  // TODO:
  // - Save initial transaction
  async add_account() {
    let id: number;
    let tempCurr: Currency;
    if (this.currencyType === 'fiat') {
      tempCurr = new Currency('EUR', CurrencyType.Fiat);
    } else if (this.currencyType === 'crypto') {
      tempCurr = new Currency('BTC', CurrencyType.Crypto);
    }
    id = await this.userDataService.add_account(this.nameOfAccount, tempCurr);
    this.userDataService.add_transaction(
      id,
      new Transaction(
        new Date(),
        new Amount(tempCurr, this.valueOfAccount),
        this.valueOfAccount
      )
    );
    this.navigationStateService.goBack();
  }
  verifyForm() {
    // TODO:
    // - Proper form validation
    if (
      this.valueOfAccount !== '' &&
      this.nameOfAccount !== '' &&
      (this.cryptoChoice !== '' || this.fiatChoice !== '')
    ) {
      return false;
    } else {
      return true;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CurrencyType } from 'src/app/enums/currency-type.enum';
import { Currency } from 'src/app/models/currency';
import { CurrenciesService } from 'src/app/providers/currencies.service';
import { NavigationStateService } from 'src/app/providers/navigation-state.service';
import { UserDataService } from 'src/app/providers/user-data.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.page.html',
  styleUrls: ['./add-account.page.scss']
})
export class AddAccountPage implements OnInit {
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

  ngOnInit() {}

  // TODO:
  // - Save initial transaction
  add_account() {
    if (this.currencyType === 'fiat') {
      const tempCurr = new Currency('EUR', CurrencyType.Fiat);
      this.userDataService.add_account(this.nameOfAccount, tempCurr);
    } else if (this.currencyType === 'crypto') {
      const tempCurr = new Currency('BTC', CurrencyType.Crypto);
      this.userDataService.add_account(this.nameOfAccount, tempCurr);
    }
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

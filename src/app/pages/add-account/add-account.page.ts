import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/providers/user-data.service';
import { CurrenciesService } from 'src/app/providers/currencies.service';
import { FiatCode } from 'src/app/enums/fiat-code.enum';
import { Currency } from 'src/app/models/currency';
import { CryptoCode } from 'src/app/enums/crypto-code.enum';
import { NavController } from '@ionic/angular';

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
    private currencies: CurrenciesService,
    private UserData: UserDataService,
    private navCtrl: NavController
  ) {
    // TODO
    this.fiatCurrencies = currencies.get_fiat_currencies().rates;
    this.cryptoCurrencies = currencies.get_crypto_currencies();
  }

  ngOnInit() {}

  // TODO
  add_account() {
    if (this.currencyType === 'fiat') {
      const tempCurr = new Currency(FiatCode.EUR, false);
      this.UserData.add_account(this.nameOfAccount, tempCurr);
    } else if (this.currencyType === 'crypto') {
      const tempCurr = new Currency(CryptoCode.BTC, false);
      this.UserData.add_account(this.nameOfAccount, tempCurr);
    }
    this.navCtrl.pop();
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

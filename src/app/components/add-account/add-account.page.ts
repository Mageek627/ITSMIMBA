import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CurrencyType } from '../../enums/currency-type.enum';
import { Amount } from '../../models/amount';
import { Currency } from '../../models/currency';
import { Transaction } from '../../models/transaction';
import { CurrenciesService } from '../../providers/currencies.service';
import { NavigationStateService } from '../../providers/navigation-state.service';
import { UserDataService } from '../../providers/user-data.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.page.html',
  styleUrls: ['./add-account.page.scss']
})
export class AddAccountPage {
  public fiatCurrencies: any;
  public cryptoCurrencies: any;
  public currencyType = 'none';
  public nameOfAccount: string;
  public valueOfAccount: string;
  public cryptoChoice = '';
  public fiatChoice = '';

  constructor(
    private currenciesService: CurrenciesService,
    private userDataService: UserDataService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private navigationStateService: NavigationStateService
  ) {
    this.fiatCurrencies = currenciesService.get_fiat_currencies().rates;
    this.cryptoCurrencies = currenciesService.get_crypto_currencies();
  }

  // TODO:
  // - Save initial transaction
  public async add_account(): Promise<void> {
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
        new Amount(tempCurr, Number(this.valueOfAccount)),
        Number(this.valueOfAccount)
      )
    );
    this.dismissItself();
    // TODO:
    // - Add successful toast message
  }
  public verifyForm(): boolean {
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

  public dismissItself(): void {
    this.modalCtrl.dismiss();
  }
}

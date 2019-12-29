import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { CurrencyType } from 'src/app/enums/currency-type.enum';
import { Amount } from 'src/app/models/amount';
import { Currency } from 'src/app/models/currency';
import { Transaction } from 'src/app/models/transaction';
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
  public addAccountForm: FormGroup;

  constructor(
    private currenciesService: CurrenciesService,
    private userDataService: UserDataService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private navigationStateService: NavigationStateService
  ) {
    this.fiatCurrencies = currenciesService.get_fiat_currencies().rates;
    this.cryptoCurrencies = currenciesService.get_crypto_currencies();
    this.addAccountForm = new FormGroup({
      nameOfAccount: new FormControl('', Validators.required),
      currencyType: new FormControl('none', Validators.required),
      fiatChoice: new FormControl(''),
      cryptoChoice: new FormControl(''),
      currentValue: new FormControl('', [
        Validators.required,
        Validators.pattern('-?[0-9]*(,|.)?[0-9]*')
      ])
    });
  }

  public toggleCurrencyType(): void {
    if (this.addAccountForm.controls.currencyType.value === 'fiat') {
      this.addAccountForm.controls.fiatChoice.setValidators(
        Validators.required
      );
      this.addAccountForm.controls.cryptoChoice.setValidators(null);
    } else if (this.addAccountForm.controls.currencyType.value === 'crypto') {
      this.addAccountForm.controls.cryptoChoice.setValidators(
        Validators.required
      );
      this.addAccountForm.controls.fiatChoice.setValidators(null);
    }
  }

  public onSubmit() {
    this.add_account();
  }

  // TODO:
  // - Save initial transaction
  public async add_account(): Promise<void> {
    let id: number;
    let tempCurr: Currency;
    if (this.addAccountForm.controls.currencyType.value === 'fiat') {
      tempCurr = new Currency('EUR', CurrencyType.Fiat);
    } else if (this.addAccountForm.controls.currencyType.value === 'crypto') {
      tempCurr = new Currency('BTC', CurrencyType.Crypto);
    }
    id = await this.userDataService.add_account(
      this.addAccountForm.controls.nameOfAccount.value,
      tempCurr
    );
    this.userDataService.add_transaction(
      id,
      new Transaction(
        new Date(),
        new Amount(
          tempCurr,
          Number(this.addAccountForm.controls.currentValue.value)
        ),
        Number(this.addAccountForm.controls.currentValue.value)
      )
    );
    this.dismissItself();
    // TODO:
    // - Add successful toast message
  }

  public dismissItself(): void {
    this.modalCtrl.dismiss();
  }
}

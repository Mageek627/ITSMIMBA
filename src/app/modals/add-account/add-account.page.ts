import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Constants } from '../../data/constants';
import { CurrencyType } from '../../enums/currency-type.enum';
import { Amount } from '../../models/amount';
import { Currency } from '../../models/currency';
import { Transaction } from '../../models/transaction';
import { CurrenciesService } from '../../providers/currencies.service';
import { NavigationStateService } from '../../providers/navigation-state.service';
import { UserDataService } from '../../providers/user-data.service';
import { LogUtils } from '../../utils/log-utils';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.page.html',
  styleUrls: ['./add-account.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAccountPage {
  public fiatCurrencies: any;
  public cryptoCurrencies: any;
  public addAccountForm: FormGroup;
  public toasted = false;

  constructor(
    private currenciesService: CurrenciesService,
    private userDataService: UserDataService,
    private modalCtrl: ModalController,
    private navigationStateService: NavigationStateService,
    private toastCtrl: ToastController,
    private logUtils: LogUtils
  ) {
    this.fiatCurrencies = currenciesService.get_fiat_currencies().rates;
    this.cryptoCurrencies = currenciesService.get_crypto_currencies();
    this.addAccountForm = new FormGroup({
      nameOfAccount: new FormControl('', Validators.required),
      currencyType: new FormControl('', Validators.required),
      fiatChoice: new FormControl(''),
      cryptoChoice: new FormControl(''),
      currentValue: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.moneyRegex)
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
    this.addAccountForm.controls.fiatChoice.updateValueAndValidity();
    this.addAccountForm.controls.cryptoChoice.updateValueAndValidity();
  }

  public duplicate(): boolean {
    for (const a of this.userDataService.accounts) {
      if (this.addAccountForm.controls.nameOfAccount.value === a.name) {
        return true;
      }
    }
    return false;
  }

  public async onSubmit(): Promise<void> {
    if (this.duplicate()) {
      if (!this.toasted) {
        this.logUtils.toast('Account name already used');
        this.toasted = true;
        setInterval(() => (this.toasted = false), 2000);
      }
      return;
    }
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
    await this.userDataService.addTransaction(
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
    await this.dismissItself();
    await this.logUtils.toast('Account created successfully');
  }

  public async dismissItself(): Promise<void> {
    await this.navigationStateService.dismissModal();
  }
}

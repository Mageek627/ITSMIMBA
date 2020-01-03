import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Constants } from '../../data/constants';
import { Amount } from '../../models/amount';
import { Transaction } from '../../models/transaction';
import { NavigationStateService } from '../../providers/navigation-state.service';
import { UserDataService } from '../../providers/user-data.service';
import { LogUtils } from '../../utils/log-utils';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.page.html',
  styleUrls: ['./add-transaction.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTransactionPage {
  public addTransactionForm: FormGroup;
  @Input() accountNumber: number;

  constructor(
    private modalCtrl: ModalController,
    private logUtils: LogUtils,
    private userDataService: UserDataService,
    private navigationStateService: NavigationStateService
  ) {
    this.addTransactionForm = new FormGroup({
      dateOfTransaction: new FormControl(
        new Date().toJSON().slice(0, 10),
        Validators.required
      ),
      valueOfTransaction: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.moneyRegex)
      ]),
      labelOfTransaction: new FormControl('')
    });
  }

  public async onSubmit(): Promise<void> {
    const dateOfTransaction: Date = new Date(
      this.addTransactionForm.controls.dateOfTransaction.value
    );
    const amountOfTransaction = new Amount(
      this.userDataService.accounts[this.accountNumber].currency,
      this.addTransactionForm.controls.valueOfTransaction.value
    );
    const t = new Transaction(
      dateOfTransaction,
      amountOfTransaction,
      this.addTransactionForm.controls.valueOfTransaction.value,
      this.addTransactionForm.controls.labelOfTransaction.value
    );
    await this.userDataService.addTransaction(this.accountNumber, t);
    await this.dismissItself();
    await this.logUtils.toast('Transaction added');
  }

  public async dismissItself(): Promise<void> {
    await this.navigationStateService.dismissModal();
  }
}

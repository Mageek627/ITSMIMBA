import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Big } from 'big.js';
import { Constants } from '../../data/constants';
import { Transfer } from '../../models/transfer';
import { NavigationStateService } from '../../providers/navigation-state.service';
import { UserDataService } from '../../providers/user-data.service';
import { DateUtils } from '../../utils/date-utils';
import { LogUtils } from '../../utils/log-utils';
import { MathsUtils } from '../../utils/maths-utils';

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
    private logUtils: LogUtils,
    public userDataService: UserDataService,
    private navigationStateService: NavigationStateService
  ) {
    this.addTransactionForm = new FormGroup({
      dateOfTransaction: new FormControl(
        new Date().toJSON(),
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
    const val = MathsUtils.safeBig(
      this.addTransactionForm.controls.valueOfTransaction.value
    );
    if (val === null) {
      return;
    }
    let t: Transfer;
    if (MathsUtils.positive(val)) {
      t = new Transfer(
        this.addTransactionForm.controls.labelOfTransaction.value,
        this.accountNumber,
        null,
        val,
        null,
        DateUtils.toTimestamp(dateOfTransaction),
        0
      );
    } else if (MathsUtils.negative(val)) {
      t = new Transfer(
        this.addTransactionForm.controls.labelOfTransaction.value,
        null,
        this.accountNumber,
        null,
        val.times(-1),
        DateUtils.toTimestamp(dateOfTransaction),
        0
      );
    } else {
      t = new Transfer(
        this.addTransactionForm.controls.labelOfTransaction.value,
        null,
        this.accountNumber,
        null,
        new Big(0),
        DateUtils.toTimestamp(dateOfTransaction),
        0
      );
    }
    const account = this.userDataService.accounts[this.accountNumber];
    const oldGenesis = account.timeOfInitial;
    if (DateUtils.toTimestamp(dateOfTransaction) <= oldGenesis) {
      account.timeOfInitial = DateUtils.toTimestamp(dateOfTransaction) - 1;
      const y = MathsUtils.relevantAmount(t, this.accountNumber);
      const x = MathsUtils.safeBig(account.initialAmount);
      if (x === null || y === null) {
        LogUtils.error('initialAmount or new value is null !');
      } else {
        account.initialAmount = x.add(y.times(-1)).toString();
      }
    }
    await this.userDataService.addTransfer(t);
    await this.dismissItself();
    await this.logUtils.toast('Transaction added');
  }

  public async dismissItself(): Promise<void> {
    await this.navigationStateService.dismissModal();
  }
}

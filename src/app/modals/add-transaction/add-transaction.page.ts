import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Big } from 'big.js';
import { Constants } from '../../data/constants';
import { Account } from '../../models/account';
import { Transfer } from '../../models/transfer';
import { NavStateService } from '../../providers/navigation-state.service';
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
export class AddTransactionPage implements OnInit {
  public addTransactionForm: FormGroup;
  @Input() accountNumber: number;
  @Input() goalModify: boolean;
  @Input() trxId: number;
  @Input() sortedTransfers: Transfer[];

  private account: Account;
  private foundTransfer: { external: boolean; index: number };

  constructor(
    private logUtils: LogUtils,
    public userDataService: UserDataService,
    private navigationStateService: NavStateService,
    private alertCtrl: AlertController,
    private dateUtils: DateUtils,
    private modalCtrl: ModalController
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

  ngOnInit() {
    this.account = this.userDataService.accounts[this.accountNumber];
    if (this.goalModify) {
      if (this.trxId === -1) {
        this.addTransactionForm.controls.labelOfTransaction.disable();
        this.addTransactionForm.controls.dateOfTransaction.setValue(
          new Date(this.account.timeOfInitial * 1000).toJSON()
        );
        this.addTransactionForm.controls.labelOfTransaction.setValue(
          'Initial amount'
        );
        this.addTransactionForm.controls.valueOfTransaction.setValue(
          this.account.initialAmount
        );
      } else {
        const obj = this.findTransfer(this.trxId);
        if (obj === null) {
          LogUtils.error('Transfer with id===trxId not found');
        } else {
          this.foundTransfer = obj;
          if (obj.external) {
            this.copyTransferValues(this.account.externalTransfers[obj.index]);
          } else {
            this.copyTransferValues(
              this.userDataService.internalTransfers[obj.index]
            );
          }
        }
      }
    }
  }

  public confirmDelete(): void {
    this.alertCtrl
      .create({
        header: 'Confirm deletion?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Confirm',
            handler: async () => {
              this.delete();
              await this.userDataService.saveData();
              await this.dismissItself();
              await this.logUtils.toast('Transaction deleted');
            }
          }
        ]
      })
      .then(x => x.present());
  }

  private delete(): void {
    this.userDataService.removeTransferNoSave(
      this.foundTransfer,
      this.accountNumber
    );
  }

  private findTransfer(
    id: number
  ): { external: boolean; index: number } | null {
    for (let i = 0; i < this.account.externalTransfers.length; i++) {
      const t = this.account.externalTransfers[i];
      if (t.id === this.trxId) {
        return { external: true, index: i };
      }
    }
    for (let i = 0; i < this.userDataService.internalTransfers.length; i++) {
      const t = this.userDataService.internalTransfers[i];
      if (t.id === this.trxId) {
        return { external: false, index: i };
      }
    }
    return null;
  }

  private copyTransferValues(t: Transfer): void {
    if (t.id === this.trxId) {
      this.addTransactionForm.controls.labelOfTransaction.setValue(t.label);
      const x = MathsUtils.relevantAmount(t, this.accountNumber);
      if (x !== null) {
        this.addTransactionForm.controls.valueOfTransaction.setValue(
          x.times(-1).toString()
        );
      } else {
        LogUtils.error('relevantAmount is null');
      }
      this.addTransactionForm.controls.dateOfTransaction.setValue(
        DateUtils.relevantDate(t, this.accountNumber).toJSON()
      );
    }
  }

  public async onSubmit(): Promise<void> {
    const dateOfTransaction: Date = new Date(
      this.addTransactionForm.controls.dateOfTransaction.value
    );
    const val = MathsUtils.safeBig(
      this.addTransactionForm.controls.valueOfTransaction.value
    );
    if (val === null) {
      LogUtils.error('val is null');
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
    if (this.trxId === -1) {
      this.account.initialAmount = val.toString();
      this.sortedTransfers.splice(0, 1);
      for (const t2 of this.sortedTransfers) {
        const actualDate = DateUtils.relevantDate(t2, this.accountNumber);
        if (
          DateUtils.toTimestamp(actualDate) >
          DateUtils.toTimestamp(dateOfTransaction)
        ) {
          break;
        }
        const x = MathsUtils.safeBig(this.account.initialAmount);
        const y = MathsUtils.relevantAmount(t2, this.accountNumber);
        if (x === null || y === null) {
          LogUtils.error('initialAmount is null !');
        } else {
          this.account.initialAmount = x.add(y.times(-1)).toString();
        }
      }
      await this.userDataService.saveData();
    } else {
      if (this.goalModify) {
        this.delete();
      }
      const oldGenesis = this.account.timeOfInitial;
      if (DateUtils.toTimestamp(dateOfTransaction) <= oldGenesis) {
        this.account.timeOfInitial =
          DateUtils.toTimestamp(dateOfTransaction) - 1;
        const y = MathsUtils.relevantAmount(t, this.accountNumber);
        const x = MathsUtils.safeBig(this.account.initialAmount);
        if (x === null || y === null) {
          LogUtils.error('initialAmount or new value is null !');
        } else {
          this.account.initialAmount = x.add(y.times(-1)).toString();
        }
      }
      if (this.goalModify) {
        await this.userDataService.addTransferSpecificPlace(
          this.foundTransfer,
          this.accountNumber,
          t
        );
      } else {
        await this.userDataService.addTransfer(t);
      }
    }
    await this.dismissItself();
    if (!this.goalModify) {
      await this.logUtils.toast('Transaction added');
    }
  }

  public async dismissItself(): Promise<void> {
    await this.modalCtrl.dismiss();
  }
}

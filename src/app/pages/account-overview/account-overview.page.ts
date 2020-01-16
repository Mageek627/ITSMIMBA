import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Big } from 'big.js';
import { GeneralUtils } from 'src/app/utils/general-utils';
import { LogUtils } from 'src/app/utils/log-utils';
import { MathsUtils } from 'src/app/utils/maths-utils';
import { Occurrence } from '../../enums/occurrence.enum';
import { AddPaymentPage } from '../../modals/add-payment/add-payment.page';
import { AddTransactionPage } from '../../modals/add-transaction/add-transaction.page';
import { Account } from '../../models/account';
import { Transfer } from '../../models/transfer';
import { NavigationStateService } from '../../providers/navigation-state.service';
import { UserDataService } from '../../providers/user-data.service';
import { DateUtils } from '../../utils/date-utils';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.page.html',
  styleUrls: ['./account-overview.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOverviewPage {
  public account: Account;
  public accountNumber: number;
  public DateUtils = DateUtils;
  public sortedTransfers: Transfer[];
  public transfersByDay: [Transfer, string | null][][];
  public MathsUtils = MathsUtils;
  public currentValue: string;
  private toasted = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public userDataService: UserDataService,
    private modalCtrl: ModalController,
    public navigationStateService: NavigationStateService,
    private cdr: ChangeDetectorRef,
    private dateUtils: DateUtils,
    public alertCtrl: AlertController,
    private logUtils: LogUtils
  ) {
    this.activatedRoute.params.subscribe(params => {
      // Getting value from url parameter
      this.accountNumber = Number(params.accountId);
      this.account = this.userDataService.accounts[this.accountNumber];
      this.updateTransfers();
    });
  }

  public changeName() {
    this.alertCtrl
      .create({
        inputs: [
          {
            name: 'name',
            type: 'text',
            value: this.account.name,
            placeholder: 'New name'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Ok',
            handler: promptData => {
              if (promptData.name !== '') {
                if (
                  GeneralUtils.duplicateAccountName(
                    promptData.name,
                    this.userDataService.accounts,
                    this.account.name
                  )
                ) {
                  if (!this.toasted) {
                    this.logUtils.toast('Account name already used');
                    this.toasted = true;
                    setTimeout(() => (this.toasted = false), 2000);
                  }
                  return false;
                } else {
                  this.userDataService.changeName(
                    this.accountNumber,
                    promptData.name
                  );
                }
              }
            }
          }
        ]
      })
      .then(x => x.present());
  }

  public formattedAmount(t: Transfer): string {
    const b = MathsUtils.relevantAmount(t, this.accountNumber);
    return b ? (!MathsUtils.negative(b) ? '+' : '') + b.toString() : '';
  }

  private updateTransfers(): void {
    this.transfersByDay = [];
    this.sortedTransfers = DateUtils.sortByTimestamp(
      this.account.externalTransfers.concat(
        this.filtered(
          this.userDataService.internalTransfers,
          this.accountNumber
        )
      ),
      this.accountNumber
    );
    this.sortedTransfers.unshift(
      new Transfer(
        'Initial amount',
        null,
        this.accountNumber,
        null,
        MathsUtils.safeBig(this.account.initialAmount),
        this.account.timeOfInitial,
        0,
        -1
      )
    );
    let i = -1;
    let currentDate: Date | null = null;
    let tempArray: [Transfer, string | null][] = [];
    for (const t of this.sortedTransfers) {
      const preciseDate = DateUtils.relevantDate(t, this.accountNumber);
      if (!DateUtils.datesAreOnSameDay(currentDate, preciseDate)) {
        i++;
        currentDate = preciseDate;
        this.transfersByDay.push(tempArray);
        tempArray = [];
      }
      const values: [Transfer, null] = [t, null];
      tempArray.push(values);
    }
    this.transfersByDay.push(tempArray);
    this.transfersByDay.shift();
    let sum = new Big(0);
    for (const d of this.transfersByDay) {
      for (const tuple of d) {
        const a = MathsUtils.relevantAmount(tuple[0], this.accountNumber);
        if (a !== null) {
          sum = sum.add(a);
          tuple[1] = sum.toString();
          if (
            DateUtils.toTimestamp(
              DateUtils.relevantDate(tuple[0], this.accountNumber)
            ) <= DateUtils.now()
          ) {
            this.currentValue = tuple[1];
          }
        }
      }
    }
  }

  // Only necessary to assert non null label
  public nonNullLabel(tuple: [Transfer, string | null]): string {
    return tuple[0].label;
  }

  private filtered(arr: Transfer[], n: number): Transfer[] {
    const arr2: Transfer[] = [];
    for (const t of arr) {
      if (t.from === n || t.to === n) {
        arr2.push(t);
      }
    }
    return arr2;
  }

  public occurrenceToText(
    occurrence: Occurrence,
    howMany: number,
    factor: number
  ): string {
    let res: string;
    if (howMany === 1) {
      res = 'only once';
    } else {
      if (factor === 1) {
        res = Occurrence[occurrence];
        res = res.toLowerCase();
      } else {
        res = 'every ';
        switch (occurrence) {
          case Occurrence.Daily:
            if (factor % 7 === 0) {
              res += Math.floor(factor / 7) + ' weeks';
            } else {
              res += factor + ' days';
            }
            break;
          case Occurrence.Monthly:
            if (factor % 12 === 0) {
              res += Math.floor(factor / 12) + ' years';
            }
            res += factor + ' months';
            break;
        }
      }
      if (howMany !== -1) {
        res += ', ' + howMany + ' times';
      }
    }
    return res;
  }

  public textTransfer(t: Transfer) {
    let res = '';
    if (t.from === null && t.to === this.accountNumber) {
      res =
        'Gained ' +
        t.amountDestination +
        ' ' +
        this.account.assetRef.code +
        (t.label === '' ? '' : ' for ' + t.label) +
        ' on the ' +
        this.dateUtils.format(t.timestampDeparture + t.delayForArrival);
    } else if (t.from === this.accountNumber && t.to === null) {
      res =
        'Spent ' +
        t.amountOrigin +
        ' ' +
        this.account.assetRef.code +
        (t.label === '' ? '' : ' for ' + t.label) +
        ' on the ' +
        this.dateUtils.format(t.timestampDeparture);
    } else if (t.from !== null && t.to !== null) {
      if (t.from === this.accountNumber) {
        res =
          'Transfer of ' +
          t.amountOrigin +
          ' ' +
          this.account.assetRef.code +
          ' to ' +
          this.userDataService.accounts[t.to] +
          ' account' +
          (t.label === '' ? '' : ' for ' + t.label) +
          ' on the ' +
          this.dateUtils.format(t.timestampDeparture);
      } else if (t.to === this.accountNumber) {
        res =
          'Transfer of ' +
          t.amountDestination +
          ' ' +
          this.account.assetRef.code +
          ' from ' +
          this.userDataService.accounts[t.from] +
          ' account' +
          (t.label === '' ? '' : ' for ' + t.label) +
          ' on the ' +
          this.dateUtils.format(t.timestampDeparture + t.delayForArrival);
      }
    }
    return res;
  }

  public async presentModalTransaction(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddTransactionPage,
      componentProps: {
        accountNumber: this.accountNumber,
        goalModify: false
      }
    });
    await modal.present();
    this.navigationStateService.history.push(null);
    await modal.onWillDismiss();
    this.updateTransfers();
    this.cdr.detectChanges();
  }
  public async presentModalModifyTransaction(
    i: number,
    j: number
  ): Promise<void> {
    const trxId = this.transfersByDay[i][j][0].id;
    const modal = await this.modalCtrl.create({
      component: AddTransactionPage,
      componentProps: {
        accountNumber: this.accountNumber,
        goalModify: true,
        trxId,
        sortedTransfers: trxId === -1 ? this.sortedTransfers : []
      }
    });
    await modal.present();
    this.navigationStateService.history.push(null);
    await modal.onWillDismiss();
    this.updateTransfers();
    this.cdr.detectChanges();
  }
  public async presentModalPayment(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddPaymentPage,
      componentProps: {
        accountNumber: this.accountNumber
      }
    });
    await modal.present();
    this.navigationStateService.history.push(null);
    await modal.onWillDismiss();
    this.updateTransfers();
    this.cdr.detectChanges();
  }

  ionViewWillLeave() {
    this.modalCtrl.dismiss().catch(() => null);
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
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

  constructor(
    private activatedRoute: ActivatedRoute,
    public userDataService: UserDataService,
    private modalCtrl: ModalController,
    public navigationStateService: NavigationStateService,
    private cdr: ChangeDetectorRef,
    private dateUtils: DateUtils
  ) {
    this.activatedRoute.params.subscribe(params => {
      // Getting value from url parameter
      this.accountNumber = Number(params.accountId);
      this.account = this.userDataService.accounts[this.accountNumber];
      this.updateTransfers();
    });
  }

  private updateTransfers(): void {
    this.sortedTransfers = DateUtils.sortByTimestamp(
      this.account.externalTransfers.concat(
        this.filtered(
          this.userDataService.internalTransfers,
          this.accountNumber
        )
      ),
      this.accountNumber
    );
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
            res += factor + ' months';
            break;
          case Occurrence.Yearly:
            res += factor + 'years';
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
        accountNumber: this.accountNumber
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

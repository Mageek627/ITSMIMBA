import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Occurrence } from 'src/app/enums/occurrence.enum';
import { AddPaymentPage } from 'src/app/modals/add-payment/add-payment.page';
import { AddTransactionPage } from 'src/app/modals/add-transaction/add-transaction.page';
import { Account } from '../../models/account';
import { NavigationStateService } from '../../providers/navigation-state.service';
import { UserDataService } from '../../providers/user-data.service';
@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.page.html',
  styleUrls: ['./account-overview.page.scss']
})
export class AccountOverviewPage {
  public account: Account;
  private accountNumber: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userDataService: UserDataService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    public navigationStateService: NavigationStateService
  ) {
    this.activatedRoute.params.subscribe(params => {
      // Getting value from url parameter
      this.accountNumber = Number(params.accountId);
      this.account = userDataService.accounts[this.accountNumber];
    });
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

  public presentModalTransaction(): void {
    this.modalCtrl
      .create({
        component: AddTransactionPage,
        componentProps: {
          accountNumber: this.accountNumber
        }
      })
      .then(modal => modal.present());
    this.navigationStateService.history.push(null);
  }
  public presentModalPayment(): void {
    this.modalCtrl
      .create({
        component: AddPaymentPage,
        componentProps: {
          accountNumber: this.accountNumber
        }
      })
      .then(modal => modal.present());
    this.navigationStateService.history.push(null);
  }
}

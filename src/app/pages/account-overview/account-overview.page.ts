import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddPaymentPage } from 'src/app/components/add-payment/add-payment.page';
import { AddTransactionPage } from 'src/app/components/add-transaction/add-transaction.page';
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private userDataService: UserDataService,
    private modalCtrl: ModalController,
    public navigationStateService: NavigationStateService
  ) {
    this.activatedRoute.params.subscribe(params => {
      // Getting value from url parameter
      this.account = userDataService.get_accounts()[Number(params.accountId)];
    });
  }

  presentModalTransaction() {
    this.modalCtrl
      .create({
        component: AddTransactionPage
      })
      .then(modal => modal.present());
  }
  presentModalPayment() {
    this.modalCtrl
      .create({
        component: AddPaymentPage
      })
      .then(modal => modal.present());
  }
}

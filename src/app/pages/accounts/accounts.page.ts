import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddAccountPage } from '../../modals/add-account/add-account.page';
import { Account } from '../../models/account';
import { NavigationStateService } from '../../providers/navigation-state.service';
import { UserDataService } from '../../providers/user-data.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss']
})
export class AccountsPage {
  public listAccounts: Account[];

  constructor(
    private userDataService: UserDataService,
    private modalCtrl: ModalController,
    public navigationStateService: NavigationStateService
  ) {}

  public presentModal(): void {
    this.modalCtrl
      .create({
        component: AddAccountPage
      })
      .then(modal => modal.present());
  }

  ionViewWillEnter() {
    this.listAccounts = this.userDataService.accounts;
  }

  ionViewWillLeave() {
    this.modalCtrl.dismiss().catch(() => null);
  }
}

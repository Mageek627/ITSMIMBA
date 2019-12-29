import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavigationStateService } from 'src/app/providers/navigation-state.service';
import { AddAccountPage } from '../../components/add-account/add-account.page';
import { Account } from '../../models/account';
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

  test() {
    console.log(123);
  }

  public presentModal() {
    this.modalCtrl
      .create({
        component: AddAccountPage
      })
      .then(modal => modal.present());
  }

  ionViewWillEnter() {
    this.listAccounts = this.userDataService.get_accounts();
  }

  ionViewWillLeave() {
    this.modalCtrl.dismiss();
  }
}

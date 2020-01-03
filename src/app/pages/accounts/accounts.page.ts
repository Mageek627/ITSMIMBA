import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddAccountPage } from '../../modals/add-account/add-account.page';
import { Account } from '../../models/account';
import { NavigationStateService } from '../../providers/navigation-state.service';
import { UserDataService } from '../../providers/user-data.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsPage {
  public listAccounts: Account[];

  constructor(
    private userDataService: UserDataService,
    private modalCtrl: ModalController,
    public navigationStateService: NavigationStateService,
    private cdr: ChangeDetectorRef
  ) {
    this.listAccounts = this.userDataService.accounts;
  }

  public async presentModal(): Promise<void> {
    this.modalCtrl.dismiss().catch(() => null);
    const modal = await this.modalCtrl.create({
      component: AddAccountPage
    });
    await modal.present();
    this.navigationStateService.history.push(null);
    await modal.onWillDismiss();
    this.listAccounts = this.userDataService.accounts;
    this.cdr.detectChanges();
  }

  ionViewWillLeave() {
    this.modalCtrl.dismiss().catch(() => null);
  }
}

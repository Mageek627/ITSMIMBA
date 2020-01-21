import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewRef
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddAccountPage } from '../../modals/add-account/add-account.page';
import { Account } from '../../models/account';
import { NavStateService } from '../../providers/navigation-state.service';
import { UserDataService } from '../../providers/user-data.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsPage {
  public listAccounts: Account[];
  public NavStateService = NavStateService;

  constructor(
    private userDataService: UserDataService,
    private modalCtrl: ModalController,
    public navigationStateService: NavStateService,
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
    await modal.onWillDismiss();
    this.listAccounts = this.userDataService.accounts;
    if (!(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }
  }
}

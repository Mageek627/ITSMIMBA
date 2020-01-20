import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OverlayType } from 'src/app/enums/overlay-type.enum';
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
    NavStateService.addOverlay(OverlayType.Modal);
    await modal.onWillDismiss();
    this.listAccounts = this.userDataService.accounts;
    this.cdr.detectChanges();
  }

  ionViewWillLeave() {
    this.navigationStateService.leavePage();
  }
}

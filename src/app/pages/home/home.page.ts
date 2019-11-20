import { Component, OnInit } from '@angular/core';
import { Platform, MenuController, NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

import { UserDataService } from '../../providers/user-data.service';
import { CurrenciesService } from 'src/app/providers/currencies.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  private isHere: boolean;
  private mainMenuId = 'main-menu';

  constructor(
    private userData: UserDataService,
    private currencies: CurrenciesService,
    private platform: Platform,
    private menu: MenuController,
    private navCtrl: NavController
  ) {
    userData.create_dummy_accounts();
  }

  ngOnInit() {
    Plugins.App.addListener('backButton', data => {
      this.menu.isOpen(this.mainMenuId).then(open => {
        if (open) {
          this.menu.close(this.mainMenuId);
        } else if (this.isHere) {
          Plugins.App.exitApp();
        } else {
          this.navCtrl.pop();
        }
      });
    });
  }

  ionViewDidEnter() {
    this.isHere = true;
  }

  ionViewWillLeave() {
    this.isHere = false;
  }
}

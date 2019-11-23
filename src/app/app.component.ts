import { Component, OnInit } from '@angular/core';
import { MenuState } from './enums/menu-state.enum';
import { Plugins } from '@capacitor/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { UserDataService } from './providers/user-data.service';
import { CurrenciesService } from './providers/currencies.service';
import { StorageUtils } from './utils/storage-utils';
import { Keys } from 'src/data/keys';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public menuState = MenuState.isClosed;
  private listOfRootPages = ['/', '/home'];
  private mainMenuId = 'main-menu';

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private userData: UserDataService,
    private currencies: CurrenciesService
  ) {
    userData.create_dummy_accounts();
    this.initialize();
  }

  ngOnInit() {
    Plugins.App.addListener('backButton', () => this.reactBackButton(this));
  }

  private async initialize() {
    const firstTime = await StorageUtils.get(Keys.FIRST_TIME);
    // If we never opened the app
    if (firstTime === null || Boolean(firstTime)) {
      await this.currencies.saveJSONLocal();
      await StorageUtils.set(Keys.FIRST_TIME, false);
    } else {
      await this.currencies.loadLocal();
    }
  }

  private reactBackButton(ctx: any) {
    // We pass the relevant context as parameter
    if (ctx.menuState === MenuState.isClosed) {
      if (ctx.listOfRootPages.includes(ctx.router.url)) {
        Plugins.App.exitApp();
      } else {
        ctx.navCtrl.pop(); // Default back button behavior
      }
    } else if (
      this.menuState === MenuState.isOpened ||
      this.menuState === MenuState.isOpening
    ) {
      this.menuCtrl.close(this.mainMenuId);
    }
    // Do nothing if the menu is closing
  }

  menuWillOpen() {
    this.menuState = MenuState.isOpening;
  }
  menuDidOpen() {
    this.menuState = MenuState.isOpened;
  }
  menuWillClose() {
    this.menuState = MenuState.isClosing;
  }
  menuDidClose() {
    this.menuState = MenuState.isClosed;
  }
}

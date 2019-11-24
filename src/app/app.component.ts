import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { MenuController, NavController } from '@ionic/angular';
import { Keys } from 'src/data/keys';
import { MenuState } from './enums/menu-state.enum';
import { CurrenciesService } from './providers/currencies.service';
import { UserDataService } from './providers/user-data.service';
import { StorageUtils } from './utils/storage-utils';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public menuState = MenuState.isClosed;
  private listOfRootPages = ['/home'];
  private mainMenuId = 'main-menu';

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private userDataService: UserDataService,
    private currenciesService: CurrenciesService
  ) {
    this.initialize();
  }

  // TODO:
  // - Make it more fluid ?
  public goToFromHome(url: string) {
    this.navCtrl.navigateRoot('/home').then(() => {
      this.navCtrl.navigateForward(url, { animated: false });
    });
  }

  ngOnInit() {
    // This is for Android only
    Plugins.App.addListener('backButton', () => this.reactBackButton(this));
  }

  private async initialize() {
    const firstTime = await StorageUtils.get(Keys.FIRST_TIME);
    // If we never opened the app
    if (firstTime === null || firstTime === 'true') {
      await this.currenciesService.saveJSONLocal();
      await this.userDataService.initDataFirst();
      await StorageUtils.set(Keys.FIRST_TIME, false);
    } else {
      await this.currenciesService.loadLocal();
      await this.userDataService.initData();
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

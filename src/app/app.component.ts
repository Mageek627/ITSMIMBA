import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { Keys } from 'src/data/keys';
import { MenuState } from './enums/menu-state.enum';
import { CurrenciesService } from './providers/currencies.service';
import { NavigationStateService } from './providers/navigation-state.service';
import { UserDataService } from './providers/user-data.service';
import { StorageUtils } from './utils/storage-utils';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  private listOfRootPages = ['/home'];

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private userDataService: UserDataService,
    private currenciesService: CurrenciesService,
    private navigationStateService: NavigationStateService
  ) {
    navigationStateService.initListener();
    this.initialize();
  }

  ngOnInit() {}

  // TODO:
  // - Make it more fluid ?
  public goToFromHome(url: string) {
    if (Capacitor.platform === 'android') {
      if (url === '/home') {
        this.navCtrl.navigateRoot(url).then(() => {
          this.navigationStateService.history = [url];
        });
      } else {
        this.navCtrl.navigateRoot(url).then(() => {
          this.navigationStateService.history = ['/home', url];
        });
      }
    } else {
      if (url === '/home') {
        this.navCtrl.navigateRoot(url);
      } else {
        this.navCtrl.navigateRoot('/home').then(() => {
          this.navCtrl.navigateForward(url, { animated: false });
        });
      }
    }
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

  menuWillOpen() {
    this.navigationStateService.menuState = MenuState.isOpening;
  }
  menuDidOpen() {
    this.navigationStateService.menuState = MenuState.isOpened;
  }
  menuWillClose() {
    this.navigationStateService.menuState = MenuState.isClosing;
  }
  menuDidClose() {
    this.navigationStateService.menuState = MenuState.isClosed;
  }
}

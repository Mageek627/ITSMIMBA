import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Capacitor, Plugins } from '@capacitor/core';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { MenuState } from '../enums/menu-state.enum';
import { LogUtils } from '../utils/log-utils';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  public history: (string | null)[] = [];
  public menuState = MenuState.isClosed;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private modalCtrl: ModalController
  ) {}

  public initListener(): void {
    if (Capacitor.platform === 'android') {
      Plugins.App.addListener('backButton', () => this.reactBackButton());
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  private reactBackButton(): void {
    const l = this.history.length;
    if (l > 0 && this.history[l - 1] === null) {
      this.dismissModal();
    } else {
      if (this.menuState === MenuState.isClosed) {
        this.goBack();
      } else if (
        this.menuState === MenuState.isOpened ||
        this.menuState === MenuState.isOpening
      ) {
        this.menuCtrl.close();
      }
      // Do nothing if the menu is closing
    }
  }

  public goBack(): void {
    const l = this.history.length;
    if (l > 1) {
      const url = this.history[l - 2];
      if (url === null) {
        LogUtils.error('history[l - 2]===null in goBack()');
        return;
      }
      this.navCtrl.navigateBack(url);
      this.history.splice(l - 2, 2);
    } else {
      Plugins.App.exitApp();
    }
  }

  public goBackHistoryOnly(): void {
    const l = this.history.length;
    if (l > 1) {
      this.history.splice(l - 2, 2);
    } else {
      Plugins.App.exitApp();
    }
  }

  public dismissModal(): void {
    this.modalCtrl.dismiss();
    this.history.splice(this.history.length - 1, 1);
  }
}

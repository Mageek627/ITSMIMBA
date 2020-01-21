import { Injectable } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Capacitor, Plugins } from '@capacitor/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
  NavController,
  PickerController,
  PopoverController
} from '@ionic/angular';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NavStateService {
  private static history: string[] = [];
  public static homeUrl = '/home';

  private ctrls: any[] = [
    this.modalCtrl,
    this.actionSheetCtrl,
    this.popoverCtrl,
    this.loadingCtrl,
    this.pickerCtrl,
    this.alertCtrl
  ];

  private constructor(
    private router: Router,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private pickerCtrl: PickerController,
    private loadingCtrl: LoadingController
  ) {}

  public static goBackHistoryOnly(): void {
    const l = NavStateService.history.length;
    NavStateService.history.splice(l - 2, 2);
  }

  public initListeners(): void {
    if (Capacitor.platform === 'android') {
      Plugins.App.addListener('backButton', () => this.reactBackButton());
    }
    if (!environment.production) {
      document.addEventListener('keyup', (e: KeyboardEvent) => {
        // Simulated back button for testing: Alt + Ctrl + <
        // tslint:disable-next-line: deprecation
        if (e.altKey && e.ctrlKey && e.keyCode === 188) {
          this.reactBackButton();
        }
      });
    }
    // Unsubscription happens (automatically) when the app exits
    this.router.events.subscribe((e: RouterEvent) => {
      if (e instanceof NavigationEnd) {
        this.dismissAll();
        NavStateService.history.push(e.urlAfterRedirects);
      }
    });
    // Insure it doesn't get called more than once
    this.initListeners = () => {};
  }

  private async reactBackButton(): Promise<void> {
    const overlay = (await this.getAllTop())
      .map(o => [+o.style.zIndex, o])
      .sort((a, b) => b[0] - a[0])
      .shift();

    if (typeof overlay !== 'undefined') {
      this.dismissOrClose(overlay[1]);
      return;
    }

    const l = NavStateService.history.length;
    if (l <= 1) {
      Plugins.App.exitApp();
    } else {
      const url = NavStateService.history[l - 2];
      NavStateService.history.splice(l - 2, 2);
      this.navCtrl.navigateBack(url);
    }
  }

  private dismissOrClose(o: any): Promise<void> {
    if (typeof o.close === 'function') {
      return o.close(); // For menus
    } else {
      return o.dismiss();
    }
  }

  private async getAllTop(): Promise<any[]> {
    const promises: Promise<any>[] = this.ctrls.map(v => v.getTop());
    promises.push(this.menuCtrl.getOpen());
    const results = await Promise.all(promises);
    return results.filter(o => typeof o !== 'undefined');
  }

  private async dismissAll() {
    const tops = await this.getAllTop();
    if (tops.length > 0) {
      await Promise.all(tops.map(top => this.dismissOrClose(top)));
      this.dismissAll();
    }
  }

  public resetToHomePage(): void {
    NavStateService.history = [];
    this.navCtrl.navigateRoot(NavStateService.homeUrl);
  }
}

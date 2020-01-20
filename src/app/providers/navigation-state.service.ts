import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
import { OverlayType } from '../enums/overlay-type.enum';

@Injectable({
  providedIn: 'root'
})
export class NavStateService {
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
  private static history: (string | null)[] = [];
  private static overlayTypes: OverlayType[] = [];
  public static homeUrl = '/home';
  public static loggingResult = '';

  public static addOverlay(type: OverlayType) {
    this.history.push(null);
    this.overlayTypes.push(type);
    NavStateService.loggingResult +=
      'End addOverlay:<br />' +
      JSON.stringify(NavStateService.history) +
      '<br />' +
      JSON.stringify(NavStateService.overlayTypes) +
      '<br />';
  }

  public static dismissHistoryOnly(): void {
    NavStateService.history.pop();
    NavStateService.overlayTypes.pop();
    NavStateService.loggingResult +=
      'End dismissHistoryOnly:<br />' +
      JSON.stringify(NavStateService.history) +
      '<br />' +
      JSON.stringify(NavStateService.overlayTypes) +
      '<br />';
  }

  public initListener(): void {
    if (Capacitor.platform === 'android') {
      Plugins.App.addListener('backButton', () => this.reactBackButton());
    }
    document.addEventListener('keyup', event => {
      // Alt+Ctrl+<
      if (event.altKey && event.ctrlKey && event.keyCode === 188) {
        this.reactBackButton();
      }
    });
    // Unsubscription happens (automatically) when the app exits
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        NavStateService.loggingResult +=
          'Begin NavigationEnd:<br />' +
          JSON.stringify(NavStateService.history) +
          '<br />' +
          JSON.stringify(NavStateService.overlayTypes) +
          '<br />';
        this.leavePage();
        NavStateService.history.push(event.urlAfterRedirects);
        NavStateService.overlayTypes.push(OverlayType.Page);
        NavStateService.loggingResult +=
          'End NavigationEnd:<br />' +
          JSON.stringify(NavStateService.history) +
          '<br />' +
          JSON.stringify(NavStateService.overlayTypes) +
          '<br />';
      }
    });
  }

  private reactBackButton(): void {
    const l = NavStateService.history.length;
    if (l <= 1) {
      Plugins.App.exitApp();
    } else if (NavStateService.overlayTypes[l - 1] === OverlayType.Page) {
      const url = NavStateService.history[l - 2];
      NavStateService.history.splice(l - 2, 2);
      NavStateService.overlayTypes.splice(l - 2, 2);
      this.navCtrl.navigateBack(url as string);
    } else {
      this.dismiss();
    }
  }

  public goBackHistoryOnly(): void {
    const l = NavStateService.history.length;
    NavStateService.history.splice(l - 2, 2);
    NavStateService.overlayTypes.splice(l - 2, 2);
  }

  public resetToHomePage(): void {
    NavStateService.history = [];
    NavStateService.overlayTypes = [];
    this.navCtrl.navigateRoot(NavStateService.homeUrl);
  }

  public leavePage(): void {
    let l = NavStateService.history.length;
    while (NavStateService.history[l - 1] === null) {
      this.dismiss();
      l--;
    }
  }

  public async dismiss(): Promise<void> {
    const l = NavStateService.overlayTypes.length;
    const last = NavStateService.overlayTypes[l - 1];
    if (last === OverlayType.Menu) {
      this.menuCtrl.close();
    } else {
      NavStateService.overlayTypes.pop();
      NavStateService.history.pop();
      switch (last) {
        case OverlayType.ActionSheet:
          await this.actionSheetCtrl.dismiss().catch(() => {});
          break;
        case OverlayType.Popover:
          await this.popoverCtrl.dismiss().catch(() => {});
          break;
        case OverlayType.Loading:
          await this.loadingCtrl.dismiss().catch(() => {});
          break;
        case OverlayType.Picker:
          await this.pickerCtrl.dismiss().catch(() => {});
          break;
        case OverlayType.Modal:
          await this.modalCtrl.dismiss().catch(() => {});
          break;
        case OverlayType.Alert:
          await this.alertCtrl.dismiss().catch(() => {});
          break;
      }
    }
    NavStateService.loggingResult +=
      'End dismiss:<br />' +
      JSON.stringify(NavStateService.history) +
      '<br />' +
      JSON.stringify(NavStateService.overlayTypes) +
      '<br />';
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Keys } from './data/keys';
import { MenuState } from './enums/menu-state.enum';
import { CurrenciesService } from './providers/currencies.service';
import { NavigationStateService } from './providers/navigation-state.service';
import { UserDataService } from './providers/user-data.service';
import { StorageUtils } from './utils/storage-utils';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    private userDataService: UserDataService,
    private currenciesService: CurrenciesService,
    private navigationStateService: NavigationStateService
  ) {
    navigationStateService.initListener();
    this.initialize();
  }

  private async initialize(): Promise<void> {
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

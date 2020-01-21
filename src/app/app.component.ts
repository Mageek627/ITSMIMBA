import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Keys } from './data/keys';
import { OverlayType } from './enums/overlay-type.enum';
import { NavStateService } from './providers/navigation-state.service';
import { UserDataService } from './providers/user-data.service';
import { StorageUtils } from './utils/storage-utils';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public NavStateService = NavStateService;
  public OverlayType = OverlayType;
  constructor(
    private userDataService: UserDataService,
    public navigationStateService: NavStateService
  ) {
    this.navigationStateService.initListeners();
    this.initialize();
  }

  private async initialize(): Promise<void> {
    const firstTime = await StorageUtils.get(Keys.FIRST_TIME);
    // If we never opened the app
    if (firstTime === null || firstTime === 'true') {
      await this.userDataService.initDataFirst();
      await StorageUtils.set(Keys.FIRST_TIME, false);
    } else {
      await this.userDataService.initData();
    }
  }
}

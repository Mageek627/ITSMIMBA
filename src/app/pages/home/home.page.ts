import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { LogUtils } from '../../utils/log-utils';
import { StorageUtils } from '../../utils/storage-utils';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  constructor(private logUtils: LogUtils) {}

  public async clear(): Promise<void> {
    await StorageUtils.clear();
    this.logUtils.toast('Storage cleared');
    try {
      Plugins.App.exitApp();
    } catch (e) {
      location.reload();
    }
  }
}

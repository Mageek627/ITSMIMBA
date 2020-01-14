import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild
} from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AlertController, IonTextarea } from '@ionic/angular';
import { UserDataService } from 'src/app/providers/user-data.service';
import { LogUtils } from 'src/app/utils/log-utils';
import { NavigationStateService } from '../../providers/navigation-state.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPage {
  @ViewChild('codeTextarea', { static: true }) codeTextarea: IonTextarea;

  public placeholder = '';
  public textareaVisible = false;
  public jsonCode = '';
  public isExporting = false;

  constructor(
    public navigationStateService: NavigationStateService,
    private userDataService: UserDataService,
    private logUtils: LogUtils,
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef
  ) {}

  public export(): void {
    this.textareaVisible = true;
    this.jsonCode = this.userDataService.export();
    this.isExporting = true;
    this.codeTextarea.getInputElement().then(x => x.select());
  }

  public importStepOne(): void {
    this.textareaVisible = true;
    this.jsonCode = '';
    this.isExporting = false;
    this.placeholder = 'Paste backup text here';
  }

  public askConfirm(): void {
    this.alertCtrl
      .create({
        header: 'Confirm import?',
        message: 'Warning: this will delete all your previous data !',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.logUtils.toast('Import cancelled');
            }
          },
          {
            text: 'Confirm',
            handler: () => {
              this.importStepTwo();
            }
          }
        ]
      })
      .then(x => x.present());
  }

  public copy() {
    Plugins.Clipboard.write({
      string: this.jsonCode
    }).then(() => {
      this.logUtils.toast('Copied');
      this.codeTextarea.getInputElement().then(x => x.select());
    });
  }

  public async importStepTwo(): Promise<void> {
    if (await this.userDataService.import(this.jsonCode)) {
      this.jsonCode = '';
      this.textareaVisible = false;
      this.cdr.detectChanges();
      this.logUtils.toast('Data imported successfully');
    } else {
      this.logUtils.toast('Error');
    }
  }
}

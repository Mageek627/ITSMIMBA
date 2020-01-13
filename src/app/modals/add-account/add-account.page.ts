import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../data/constants';
import { AssetType } from '../../enums/asset-type.enum';
import { Transfer } from '../../models/transfer';
import { NavigationStateService } from '../../providers/navigation-state.service';
import { UserDataService } from '../../providers/user-data.service';
import { DateUtils } from '../../utils/date-utils';
import { LogUtils } from '../../utils/log-utils';
import { MathsUtils } from '../../utils/maths-utils';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.page.html',
  styleUrls: ['./add-account.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAccountPage {
  public addAccountForm: FormGroup;
  public toasted = false;
  public Constants = Constants;
  public AssetType = AssetType;

  constructor(
    public userDataService: UserDataService,
    private navigationStateService: NavigationStateService,
    private logUtils: LogUtils
  ) {
    this.addAccountForm = new FormGroup({
      nameOfAccount: new FormControl('', Validators.required),
      typeChoice: new FormControl('', Validators.required),
      codeChoice: new FormControl('', Validators.required),
      currentValue: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.moneyRegex)
      ])
    });
  }

  public duplicateAccountName(): boolean {
    for (const a of this.userDataService.accounts) {
      if (this.addAccountForm.controls.nameOfAccount.value === a.name) {
        return true;
      }
    }
    return false;
  }

  public async onSubmit(): Promise<void> {
    if (this.duplicateAccountName()) {
      if (!this.toasted) {
        this.logUtils.toast('Account name already used');
        this.toasted = true;
        setTimeout(() => (this.toasted = false), 2000);
      }
      return;
    }
    const id = await this.userDataService.createAccount(
      this.addAccountForm.controls.nameOfAccount.value,
      AssetType[
        this.addAccountForm.controls.typeChoice.value as keyof typeof AssetType
      ],
      this.addAccountForm.controls.codeChoice.value
    );
    await this.userDataService.addTransfer(
      new Transfer(
        'Initial amount',
        null,
        id,
        null,
        MathsUtils.safeBig(this.addAccountForm.controls.currentValue.value),
        DateUtils.now(),
        0
      )
    );
    await this.dismissItself();
    await this.logUtils.toast('Account created successfully');
  }

  public async dismissItself(): Promise<void> {
    await this.navigationStateService.dismissModal();
  }
}

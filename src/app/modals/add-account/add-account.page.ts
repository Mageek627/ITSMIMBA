import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonSelect, PopoverController } from '@ionic/angular';
import { OverlayType } from 'src/app/enums/overlay-type.enum';
import { GeneralUtils } from 'src/app/utils/general-utils';
import { Constants } from '../../data/constants';
import { AssetType } from '../../enums/asset-type.enum';
import { NavStateService } from '../../providers/navigation-state.service';
import { UserDataService } from '../../providers/user-data.service';
import { LogUtils } from '../../utils/log-utils';
import { MathsUtils } from '../../utils/maths-utils';

class IonSelectableOption {
  public id: number;
  public name: string;
}

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.page.html',
  styleUrls: ['./add-account.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAccountPage implements OnInit {
  @ViewChild(IonSelect, { static: true }) private ionSelect: IonSelect;
  public addAccountForm: FormGroup;
  public toasted = false;
  public Constants = Constants;
  public AssetType = AssetType;
  public ionSelectableOptions: IonSelectableOption[];
  public ionSelectableOption: IonSelectableOption;
  public NavStateService = NavStateService;
  public OverlayType = OverlayType;

  constructor(
    public userDataService: UserDataService,
    public navigationStateService: NavStateService,
    private logUtils: LogUtils,
    public cdr: ChangeDetectorRef,
    private popoverCtrl: PopoverController
  ) {
    this.addAccountForm = new FormGroup({
      nameOfAccount: new FormControl('', Validators.required),
      typeChoice: new FormControl(
        Constants.assetTypeFullName[0][0],
        Validators.required
      ),
      codeChoice: new FormControl('', Validators.required),
      currentValue: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.moneyRegex)
      ])
    });
  }

  public caca() {
    console.log(2);
  }

  public ngOnInit(): void {
    this.changeDefaultCode(0);
  }

  public async onSubmit(): Promise<void> {
    if (
      GeneralUtils.duplicateAccountName(
        this.addAccountForm.controls.nameOfAccount.value,
        this.userDataService.accounts
      )
    ) {
      if (!this.toasted) {
        this.logUtils.toast('Account name already used');
        this.toasted = true;
        setTimeout(() => (this.toasted = false), 2000);
      }
      return;
    }
    const a = MathsUtils.safeBig(
      this.addAccountForm.controls.currentValue.value
    );
    if (a !== null) {
      const id = await this.userDataService.createAccount(
        this.addAccountForm.controls.nameOfAccount.value,
        this.n(),
        this.userDataService.assetCatalogue[this.n()][
          this.addAccountForm.controls.codeChoice.value.id
        ].assetRef.code,
        a.toString()
      );
      await this.navigationStateService.dismiss();
      await this.logUtils.toast('Account created successfully');
    } else {
      LogUtils.error('Initial amount is null');
    }
  }

  public n(): number {
    return AssetType[
      this.addAccountForm.controls.typeChoice.value as keyof typeof AssetType
    ];
  }

  public changeDefaultCode(n: number) {
    this.ionSelectableOptions = [];
    for (let i = 0; i < this.userDataService.assetCatalogue[n].length; i++) {
      let name = this.userDataService.assetCatalogue[n][i].assetRef.code;
      if (this.userDataService.assetCatalogue[n][i].name !== '') {
        name += ' (' + this.userDataService.assetCatalogue[n][i].name + ')';
      }
      this.ionSelectableOptions.push({ id: i, name });
    }
    this.addAccountForm.controls.codeChoice.setValue(
      this.ionSelectableOptions[0]
    );
  }

  public displayText(id: number): string {
    return this.userDataService.assetCatalogue[this.n()][id].assetRef.code;
  }

  public dismissItself(): void {
    this.navigationStateService.dismiss();
  }
}

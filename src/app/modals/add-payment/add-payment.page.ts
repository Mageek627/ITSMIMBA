import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../data/constants';
import { Occurrence } from '../../enums/occurrence.enum';
import { Amount } from '../../models/amount';
import { Payment } from '../../models/payment';
import { NavigationStateService } from '../../providers/navigation-state.service';
import { UserDataService } from '../../providers/user-data.service';
import { LogUtils } from '../../utils/log-utils';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.page.html',
  styleUrls: ['./add-payment.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPaymentPage {
  public addPaymentForm: FormGroup;
  @Input() accountNumber: number;

  constructor(
    private logUtils: LogUtils,
    private navigationStateService: NavigationStateService,
    private userDataService: UserDataService
  ) {
    this.addPaymentForm = new FormGroup({
      labelOfPayment: new FormControl(''),
      valueOfPayment: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.moneyRegex)
      ]),
      startDate: new FormControl(
        new Date().toJSON().slice(0, 10),
        Validators.required
      ),
      occurrence: new FormControl('', Validators.required),
      howMany: new FormControl(''),
      factor: new FormControl('')
    });
  }

  public positiveNumber(c: FormControl): any {
    if (c.value === parseInt(c.value, 10) + '' && parseInt(c.value, 10) > 0) {
      return null;
    } else {
      return { positiveNumber: { valid: false } };
    }
  }

  public howManyTest(c: FormControl): any {
    if (
      c.value === '-1' ||
      (c.value === parseInt(c.value, 10) + '' && parseInt(c.value, 10) > 1)
    ) {
      return null;
    } else {
      return { howManyTest: { valid: false } };
    }
  }

  public toggleCurrencyType(): void {
    if (this.addPaymentForm.controls.occurrence.value === 'One') {
      this.addPaymentForm.controls.howMany.setValidators(null);
      this.addPaymentForm.controls.factor.setValidators(null);
    } else {
      this.addPaymentForm.controls.howMany.setValidators([
        Validators.required,
        this.howManyTest
      ]);
      this.addPaymentForm.controls.factor.setValidators([
        Validators.required,
        this.positiveNumber
      ]);
    }
    this.addPaymentForm.controls.howMany.updateValueAndValidity();
    this.addPaymentForm.controls.factor.updateValueAndValidity();
  }

  public async onSubmit(): Promise<void> {
    const a = new Amount(
      this.userDataService.preferredBase,
      this.addPaymentForm.controls.valueOfPayment.value
    );
    let o: Occurrence;
    let f: number;
    let h: number;
    if (this.addPaymentForm.controls.occurrence.value === 'One') {
      o = Occurrence.Daily;
      h = 1;
      f = 1;
    } else {
      o = (Occurrence as any)[this.addPaymentForm.controls.occurrence.value];
      h = Number(this.addPaymentForm.controls.howMany.value);
      f = Number(this.addPaymentForm.controls.factor.value);
    }
    const p = new Payment(
      a,
      new Date(this.addPaymentForm.controls.startDate.value),
      h,
      f,
      o,
      this.addPaymentForm.controls.labelOfPayment.value
    );
    this.userDataService.addPayment(this.accountNumber, p);
    await this.dismissItself();
    await this.logUtils.toast('Payment added');
  }

  public async dismissItself(): Promise<void> {
    await this.navigationStateService.dismissModal();
  }
}

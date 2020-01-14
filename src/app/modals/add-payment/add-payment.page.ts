import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../data/constants';
import { Occurrence } from '../../enums/occurrence.enum';
import { InfiniteRecurringTransfer } from '../../models/infinite-recurring-transfer';
import { QuantifiedOccurrence } from '../../models/quantified-occurrence';
import { Transfer } from '../../models/transfer';
import { NavigationStateService } from '../../providers/navigation-state.service';
import { UserDataService } from '../../providers/user-data.service';
import { DateUtils } from '../../utils/date-utils';
import { LogUtils } from '../../utils/log-utils';
import { MathsUtils } from '../../utils/maths-utils';

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
    public userDataService: UserDataService
  ) {
    this.addPaymentForm = new FormGroup({
      labelOfPayment: new FormControl(''),
      valueOfPayment: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.moneyRegex)
      ]),
      startDate: new FormControl(new Date().toJSON(), Validators.required),
      occurrence: new FormControl('', Validators.required),
      howMany: new FormControl(''),
      factor: new FormControl(''),
      workingDaysOnly: new FormControl('true', Validators.required)
    });
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
        MathsUtils.positiveNumberValidator
      ]);
    }
    this.addPaymentForm.controls.howMany.updateValueAndValidity();
    this.addPaymentForm.controls.factor.updateValueAndValidity();
  }

  public async onSubmit(): Promise<void> {
    let o: Occurrence;
    let f: number;
    let h: number;
    if (this.addPaymentForm.controls.occurrence.value === 'One') {
      o = Occurrence.Daily;
      h = 1;
      f = 1;
    } else if (this.addPaymentForm.controls.occurrence.value === 'Weekly') {
      o = Occurrence.Daily;
      h = Number(this.addPaymentForm.controls.howMany.value);
      f = 7 * Number(this.addPaymentForm.controls.factor.value);
    } else if (this.addPaymentForm.controls.occurrence.value === 'Yearly') {
      o = Occurrence.Monthly;
      h = Number(this.addPaymentForm.controls.howMany.value);
      f = 12 * Number(this.addPaymentForm.controls.factor.value);
    } else {
      o = (Occurrence as any)[this.addPaymentForm.controls.occurrence.value];
      h = Number(this.addPaymentForm.controls.howMany.value);
      f = Number(this.addPaymentForm.controls.factor.value);
    }
    const start = new Date(this.addPaymentForm.controls.startDate.value);
    if (h === -1) {
      const t = new Transfer(
        this.addPaymentForm.controls.labelOfPayment.value,
        this.accountNumber,
        null,
        MathsUtils.safeBig(this.addPaymentForm.controls.valueOfPayment.value),
        null,
        DateUtils.toTimestamp(start),
        0
      );
      const infinite = new InfiniteRecurringTransfer(
        t,
        new QuantifiedOccurrence(
          f,
          o,
          DateUtils.toTimestamp(start),
          this.addPaymentForm.controls.workingDaysOnly.value === 'true'
        )
      );
    } else {
      let calculatedDate = start;
      for (let i = 0; i < h; i++) {
        const t = new Transfer(
          this.addPaymentForm.controls.labelOfPayment.value,
          this.accountNumber,
          null,
          MathsUtils.safeBig(this.addPaymentForm.controls.valueOfPayment.value),
          null,
          DateUtils.toTimestamp(calculatedDate),
          0
        );
        await this.userDataService.addTransfer(t);
        switch (o) {
          case Occurrence.Daily:
            calculatedDate = DateUtils.addDays(calculatedDate, f);
            break;
          case Occurrence.EverySecond:
            calculatedDate = new Date(
              (DateUtils.toTimestamp(calculatedDate) + f) * 1000
            );
            break;
          case Occurrence.Monthly:
            calculatedDate = DateUtils.addMonths(calculatedDate, f);
            break;
        }
      }
    }
    await this.dismissItself();
    await this.logUtils.toast('Payment added');
  }

  public async dismissItself(): Promise<void> {
    await this.navigationStateService.dismissModal();
  }
}

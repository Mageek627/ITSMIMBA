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
    public userDataService: UserDataService,
    private dateUtils: DateUtils
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
      (c.value === parseInt(c.value, 10) + '' && parseInt(c.value, 10) > 0)
    ) {
      return null;
    } else {
      return { howManyTest: { valid: false } };
    }
  }

  public async onSubmit(): Promise<void> {
    let o: Occurrence;
    let f: number;
    let h: number;
    if (this.addPaymentForm.controls.occurrence.value === 'Weekly') {
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
      const arr: Transfer[] = [];
      let calculatedDate = start;
      for (let i = 0; i < h; i++) {
        const actualDate = this.dateUtils.addHolidays(
          calculatedDate,
          this.addPaymentForm.controls.workingDaysOnly.value === 'true',
          this.userDataService.holidays
        );
        const t = new Transfer(
          this.addPaymentForm.controls.labelOfPayment.value,
          this.accountNumber,
          null,
          MathsUtils.safeBig(this.addPaymentForm.controls.valueOfPayment.value),
          null,
          DateUtils.toTimestamp(actualDate),
          0
        );
        arr.push(t);
        switch (o) {
          case Occurrence.Daily:
            calculatedDate = DateUtils.addDaysSimple(calculatedDate, f);
            break;
          case Occurrence.EverySecond:
            calculatedDate = DateUtils.addSecondsSimple(calculatedDate, f);
            break;
          case Occurrence.Monthly:
            calculatedDate = DateUtils.addMonthsSimple(calculatedDate, f);
            break;
        }
      }
      await this.userDataService.addManyTransfers(arr);
    }
    await this.dismissItself();
    await this.logUtils.toast('Payment added');
  }

  public async dismissItself(): Promise<void> {
    await this.navigationStateService.dismissModal();
  }
}

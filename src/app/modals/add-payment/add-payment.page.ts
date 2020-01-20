import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../data/constants';
import { Occurrence } from '../../enums/occurrence.enum';
import { InfiniteRecurringTransfer } from '../../models/infinite-recurring-transfer';
import { QuantifiedOccurrence } from '../../models/quantified-occurrence';
import { Transfer } from '../../models/transfer';
import { NavStateService } from '../../providers/navigation-state.service';
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
export class AddPaymentPage implements OnInit {
  public addPaymentForm: FormGroup;
  @Input() accountNumber: number;
  public plural = '';
  private testSpan: HTMLSpanElement;
  public inputStyle = '25px';
  public displayValue = 'month';

  constructor(
    private logUtils: LogUtils,
    private navigationStateService: NavStateService,
    public userDataService: UserDataService,
    private dateUtils: DateUtils
  ) {
    this.addPaymentForm = new FormGroup({
      labelOfPayment: new FormControl(),
      valueOfPayment: new FormControl(null, [
        Validators.required,
        Validators.pattern(Constants.moneyRegex)
      ]),
      startDate: new FormControl(new Date().toJSON(), Validators.required),
      occurrence: new FormControl('Monthly', Validators.required),
      howMany: new FormControl(null, [Validators.required, this.howManyTest]),
      factor: new FormControl(1, [
        Validators.required,
        MathsUtils.positiveNumberValidator
      ]),
      workingDaysOnly: new FormControl('true', Validators.required)
    });
  }

  ngOnInit() {
    const elem = document.getElementById('testSpan');
    if (elem === null) {
      LogUtils.error('testSpan not found');
    } else {
      this.testSpan = elem;
    }
  }

  public changeWidth() {
    this.testSpan.innerText = this.addPaymentForm.controls.factor.value;
    this.inputStyle = this.testSpan.offsetWidth + 16 + 'px';
    const intValue = parseInt(this.addPaymentForm.controls.factor.value, 10);
    if (this.addPaymentForm.controls.factor.value === null) {
      this.plural = '';
    } else if (intValue === 1) {
      this.plural = '';
    } else {
      this.plural = 's';
    }
    switch (this.addPaymentForm.controls.occurrence.value) {
      case 'Monthly':
        this.displayValue = 'month';
        break;
      case 'Yearly':
        this.displayValue = 'year';
        break;
      case 'Weekly':
        this.displayValue = 'week';
        break;
      case 'Daily':
        this.displayValue = 'day';
        break;
      case 'EverySecond':
        this.displayValue = 'second';
        break;
      default:
        this.displayValue = 'error';
        break;
    }
    this.displayValue += this.plural;
  }

  public howManyTest(c: FormControl): any {
    if (c.value === -1 || c.value > 0) {
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
      // TODO: add it
    } else {
      const arr: Transfer[] = [];
      let calculatedDate = start;
      const account = this.userDataService.accounts[this.accountNumber];
      const oldGenesis = account.timeOfInitial;
      for (let i = 0; i < h; i++) {
        const actualDate = this.dateUtils.addHolidays(
          calculatedDate,
          this.addPaymentForm.controls.workingDaysOnly.value === 'true',
          this.userDataService.holidays
        );
        const y = MathsUtils.safeBig(
          this.addPaymentForm.controls.valueOfPayment.value
        );
        if (DateUtils.toTimestamp(actualDate) <= oldGenesis) {
          if (i === 0) {
            account.timeOfInitial = DateUtils.toTimestamp(actualDate) - 1;
          }
          const x = MathsUtils.safeBig(account.initialAmount);
          if (x === null || y === null) {
            LogUtils.error('initialAmount or valueOfPayment is null !');
          } else {
            account.initialAmount = x.add(y).toString();
          }
        }
        const t = new Transfer(
          this.addPaymentForm.controls.labelOfPayment.value,
          this.accountNumber,
          null,
          y,
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
    await this.navigationStateService.dismiss();
  }
}

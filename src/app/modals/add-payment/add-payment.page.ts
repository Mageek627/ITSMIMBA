import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LogUtils } from 'src/app/utils/log-utils';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.page.html',
  styleUrls: ['./add-payment.page.scss']
})
export class AddPaymentPage {
  public addPaymentForm: FormGroup;

  constructor(private modalCtrl: ModalController, private logUtils: LogUtils) {
    this.addPaymentForm = new FormGroup({
      labelOfPayment: new FormControl(''),
      valueOfPayment: new FormControl('', Validators.required),
      startDate: new FormControl(
        new Date().toJSON().slice(0, 10),
        Validators.required
      ),
      occurrence: new FormControl('', Validators.required)
    });
  }

  public async onSubmit(): Promise<void> {
    await this.dismissItself();
    await this.logUtils.toast('Payment added');
  }

  public async dismissItself(): Promise<void> {
    await this.modalCtrl.dismiss();
  }
}

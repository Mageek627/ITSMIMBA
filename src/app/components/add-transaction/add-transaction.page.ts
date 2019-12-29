import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LogUtils } from 'src/app/utils/log-utils';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.page.html',
  styleUrls: ['./add-transaction.page.scss']
})
export class AddTransactionPage {
  public addTransactionForm: FormGroup;

  constructor(private modalCtrl: ModalController, private logUtils: LogUtils) {
    this.addTransactionForm = new FormGroup({
      nameOfTransaction: new FormControl('', Validators.required)
    });
  }

  public async onSubmit(): Promise<void> {
    await this.dismissItself();
    await this.logUtils.toast('Transaction added');
  }

  public async dismissItself(): Promise<void> {
    await this.modalCtrl.dismiss();
  }
}

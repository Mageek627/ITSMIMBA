import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddPaymentPage } from 'src/app/components/add-payment/add-payment.page';
import { AddTransactionPage } from 'src/app/components/add-transaction/add-transaction.page';
import { AccountOverviewPage } from './account-overview.page';

const routes: Routes = [
  {
    path: '',
    component: AccountOverviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [AddTransactionPage, AddPaymentPage],
  declarations: [AccountOverviewPage, AddTransactionPage, AddPaymentPage]
})
export class AccountOverviewPageModule {}

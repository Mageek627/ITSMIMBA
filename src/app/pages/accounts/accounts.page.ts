import { Component } from '@angular/core';
import { UserDataService } from 'src/app/providers/user-data.service';
import { Account } from '../../models/account';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss']
})
export class AccountsPage {
  public listAccounts: Account[];

  constructor(private userDataService: UserDataService) {}

  ionViewWillEnter() {
    this.listAccounts = this.userDataService.get_accounts();
  }
}

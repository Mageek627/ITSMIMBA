import { Component } from '@angular/core';
import { Account } from '../../models/account';
import { UserDataService } from '../../providers/user-data.service';

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

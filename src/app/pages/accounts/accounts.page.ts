import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/providers/user-data.service';

import { Account } from '../../models/account';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss']
})
export class AccountsPage implements OnInit {
  public listAccounts: Account[];

  constructor(private userData: UserDataService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.listAccounts = this.userData.get_accounts();
  }
}

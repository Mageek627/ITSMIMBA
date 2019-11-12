import { Component } from '@angular/core';

import { Account } from '../../models/account';
import { UserDataService } from '../../providers/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public dummyAccounts: Account[];

  constructor(private userData: UserDataService) {
    this.dummyAccounts = userData.get_accounts();
  }

}

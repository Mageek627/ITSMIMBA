import { Component } from '@angular/core';

import { Account } from '../../interfaces/account';
import { UserDataService } from '../../services/user-data.service';

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

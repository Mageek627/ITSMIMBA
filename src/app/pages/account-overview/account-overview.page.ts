import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationStateService } from 'src/app/providers/navigation-state.service';
import { Account } from '../../models/account';
import { UserDataService } from '../../providers/user-data.service';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.page.html',
  styleUrls: ['./account-overview.page.scss']
})
export class AccountOverviewPage {
  public account: Account;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userDataService: UserDataService,
    public navigationStateService: NavigationStateService
  ) {
    this.activatedRoute.params.subscribe(params => {
      // Getting value from url parameter
      this.account = userDataService.get_accounts()[Number(params.accountId)];
    });
  }
}

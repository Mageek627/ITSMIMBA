import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/providers/user-data.service';
import { Account } from '../../models/account';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.page.html',
  styleUrls: ['./account-overview.page.scss']
})
export class AccountOverviewPage implements OnInit {
  public account: Account;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userDataService: UserDataService
  ) {
    this.activatedRoute.params.subscribe(params => {
      // Getting value from url parameter
      this.account = userDataService.get_accounts()[Number(params.accountId)];
    });
  }

  ngOnInit() {}
}

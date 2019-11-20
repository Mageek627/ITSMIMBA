import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.page.html',
  styleUrls: ['./account-overview.page.scss']
})
export class AccountOverviewPage implements OnInit {
  public accountId: number;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.accountId = Number(params.accountId);
    });
  }

  ngOnInit() {}
}

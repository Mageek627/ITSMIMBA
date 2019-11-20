import { Component, OnInit } from '@angular/core';

import { UserDataService } from '../../providers/user-data.service';
import { CurrenciesService } from 'src/app/providers/currencies.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  constructor(
    private userData: UserDataService,
    private currencies: CurrenciesService
  ) {
    userData.create_dummy_accounts();
  }

  ngOnInit() {}
}

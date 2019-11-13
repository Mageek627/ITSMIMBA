import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.page.html',
  styleUrls: ['./add-account.page.scss']
})
export class AddAccountPage implements OnInit {
  public codes;

  constructor() {
    // TODO
    this.codes = ['BTC', 'EUR', 'USD', 'ETH'];
  }

  ngOnInit() {}
}

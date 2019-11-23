import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';

import { StorageUtils } from 'src/app/utils/storage-utils';
import { Keys } from 'src/data/keys';
import { CurrenciesService } from 'src/app/providers/currencies.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  public testValue = '';

  constructor(currencies: CurrenciesService) {
    StorageUtils.get(Keys.FIRST_TIME).then(value => {
      // If we never opened the app
      if (value === null || Boolean(value)) {
        // TODO:
        // - Convert JSON data to local database (and also load to local variable)

        // We save the fact that we already did the initialization
        StorageUtils.set(Keys.FIRST_TIME, false);
      } else {
        // TODO:
        // - Load local database to local variable
      }
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    Plugins.SplashScreen.hide();
  }
}

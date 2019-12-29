import { Component } from '@angular/core';
import { NavigationStateService } from '../../providers/navigation-state.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage {
  constructor(public navigationStateService: NavigationStateService) {}
}

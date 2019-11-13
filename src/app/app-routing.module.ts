import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'accounts',
    loadChildren: () =>
      import('./pages/accounts/accounts.module').then(m => m.AccountsPageModule)
  },
  {
    path: 'account-overview',
    loadChildren: () =>
      import('./pages/account-overview/account-overview.module').then(
        m => m.AccountOverviewPageModule
      )
  },
  {
    path: 'add-account',
    loadChildren: () =>
      import('./pages/add-account/add-account.module').then(
        m => m.AddAccountPageModule
      )
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

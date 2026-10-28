import { Routes } from '@angular/router';
import { UsersDashboardComponent } from './pages/users-dashboard/users-dashboard.component';
import { OfferDetailsComponent } from './pages/offer-details/offer-details.component';
import { CreateCodeComponent } from './pages/create-code/create-code.component';
import { CouponSuccessComponent } from './pages/coupon-success/coupon-success.component';
import { CodeDetailsComponent } from './pages/code-details/code-details.component';
import { OfferHistoryComponent } from './pages/offer-history/offer-history.component';
import { SupportComponent } from './pages/support/support.component';

export const routes: Routes = [
  { path: '', component: UsersDashboardComponent },
  { path: 'dashboard', component: UsersDashboardComponent },
  { path: 'offer/:id', component: OfferDetailsComponent },
  { path: 'create-code', component: CreateCodeComponent },
  { path: 'coupon-success', component: CouponSuccessComponent },
  { path: 'code-details/:id', component: CodeDetailsComponent },
  { path: 'code-details', component: CodeDetailsComponent },
  { path: 'offer-history', component: OfferHistoryComponent },
  { path: 'support', component: SupportComponent },
  { path: '**', redirectTo: '' }
];

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';
import { EditProfileComponent } from 'src/app/shared/components/edit-profile/edit-profile.component';
import { PrivacyPolicyComponent } from 'src/app/shared/components/privacy-policy/privacy-policy.component';
import { NotificationsComponent } from 'src/app/shared/components/notifications/notifications.component';
import { SupportComponent } from 'src/app/shared/components/support/support.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
  },
  {
    path: 'support',
    component: SupportComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}

import { SupportComponent } from './components/support/support.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { AddSelectWorkoutComponent } from './components/add-select-workout/add-select-workout.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

@NgModule({
  declarations: [ForgotPasswordComponent, HeaderComponent, LogoComponent, CustomInputComponent, AddSelectWorkoutComponent, EditProfileComponent, PrivacyPolicyComponent, NotificationsComponent, SupportComponent],
  exports: [ReactiveFormsModule, NgCircleProgressModule, ForgotPasswordComponent, HeaderComponent, LogoComponent, CustomInputComponent, AddSelectWorkoutComponent, EditProfileComponent, PrivacyPolicyComponent, NotificationsComponent, SupportComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 300,
    }),
  ],
})
export class SharedModule {}

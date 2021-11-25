import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';
import { AuthSignupComponent } from './components/auth-signup/auth-signup.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthUserProfileComponent } from './components/auth-user-profile/auth-user-profile.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AuthLoginComponent,
    AuthSignupComponent,
    AuthUserProfileComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class AuthModule { }

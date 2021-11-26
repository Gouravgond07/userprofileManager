import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/service/auth-guard.service';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';
import { AuthSignupComponent } from './components/auth-signup/auth-signup.component';
import { AuthUserProfileComponent } from './components/auth-user-profile/auth-user-profile.component';


const routes: Routes = [
  {path: 'login', component: AuthLoginComponent},
  {path: 'signup', component: AuthSignupComponent},
  {path: 'profile', component: AuthUserProfileComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

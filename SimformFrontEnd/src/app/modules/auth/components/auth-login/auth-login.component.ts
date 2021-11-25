import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '@full-fledged/alerts';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent implements OnInit {
  isSubmitted = false;
  isLoading = false;
  userForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required]
  })

  constructor(private fb: FormBuilder, private alertService: AlertService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      this.alertService.danger('Form is not correct');
    } else {
      const values = this.userForm.value;
      this.isLoading = true;
      this.authService.login(values.email, values.password).subscribe(val => {
        // redirect
        this.authService.setUser(val)
        this.alertService.success('login');
        this.isLoading = false;
        this.router.navigate(['/', 'auth', 'profile']);

      }, err => {
        console.log(err);
        this.isLoading = false;
        this.alertService.danger(err);
      })
    }
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }

}

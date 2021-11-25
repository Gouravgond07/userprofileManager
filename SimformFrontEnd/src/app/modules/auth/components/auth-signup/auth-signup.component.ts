import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '@full-fledged/alerts';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.css']
})
export class AuthSignupComponent implements OnInit {
  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  isSubmitted = false;
  isLoading = false;

  constructor(private fb: FormBuilder,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }

  signup() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      this.alertService.danger('Form is not correct');
    } else {
      const values = this.userForm.value;
      this.isLoading = true;
      this.authService.signup(values.firstName, values.lastName, values.email, values.password).subscribe(val => {
        this.isLoading = true;
        this.router.navigate(['/', 'auth', 'login']);
        this.alertService.success('Sign up successfully');
      }, err => {
        this.isLoading = true;
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
  get firstName() {
    return this.userForm.get('firstName');
  }

  get lastName() {
    return this.userForm.get('lastName');
  }



}

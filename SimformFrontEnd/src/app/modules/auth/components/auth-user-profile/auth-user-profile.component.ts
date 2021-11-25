import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '@full-fledged/alerts';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-user-profile',
  templateUrl: './auth-user-profile.component.html',
  styleUrls: ['./auth-user-profile.component.css']
})
export class AuthUserProfileComponent implements OnInit {
  profilePic = "https://cdn-icons.flaticon.com/png/512/3899/premium/3899618.png?token=exp=1637835456~hmac=1cb14ebcb5c4a6b0068e8c29ee0cd0a4";
  defaultProfilePic = "https://cdn-icons.flaticon.com/png/512/3899/premium/3899618.png?token=exp=1637835456~hmac=1cb14ebcb5c4a6b0068e8c29ee0cd0a4";
  userProfile: UserModel | undefined;
  uploadedPic: File | undefined;
  isEdit = false;
  isLoading = false;
  userProfileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['']
  });
  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router) { }

  ngOnInit(): void {
    this.getProfile();
  }

  getFileUrl(files: File[]) {
    return new Promise<string>((res, rej) => {
      var reader = new FileReader();
      reader.onload = function (e) {
        if (e.target && e.target.result) {
          res(e.target.result.toString());
        }
      };

      reader.readAsDataURL(files[0]);
    })
  }

  readURL(input: any) {
    if (input.target.files && input.target.files[0]) {
      this.getFileUrl(input.target.files).then(image => {
        this.profilePic = image;
        this.uploadedPic = input.target.files[0];
      })
    }
  }

  setFormVal(val: UserModel) {
    this.userProfile = val;
    if (this.userProfile.profileImage) {
      this.profilePic = this.userProfile.profileImage;
    } else {
      this.profilePic = this.defaultProfilePic;
    }
    this.userProfileForm.patchValue({
      firstName: this.userProfile.firstName,
      lastName: this.userProfile.lastName,
      email: this.userProfile.email,
      password: ''
    });
  }

  getProfile() {
    this.authService.getProfile().subscribe(val => {
      this.setFormVal(val);
    })
  }

  enableEdit() {
    this.isEdit = !this.isEdit;
  }

  updateProfile() {
    this.isLoading = true;
    const updateValue = this.userProfileForm.value;
    this.authService.updateProfile(updateValue.firstName, updateValue.lastName, updateValue.password, this.uploadedPic)
      .subscribe(updateValue => {
        console.log(updateValue);
        this.setFormVal(updateValue);
        // this.getProfile();
        this.isEdit = false;
        this.isLoading = false;
        this.alertService.success('Sign up successfully');
      }, err => {
        this.isLoading = false;
        this.alertService.danger(err);
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/', 'auth', 'login']);
  }

}

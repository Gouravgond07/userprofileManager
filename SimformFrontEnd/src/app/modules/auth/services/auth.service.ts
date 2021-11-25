import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  userName: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  isTwoStepAuth: boolean;
  token: string;
}




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user?: User | null;
  loginSubject = new BehaviorSubject(false);

  constructor(private http: HttpClient) { }

  login(email: String, password: String) {
    const url = `${environment.baseUrl}/user/loginUser`;
    const data = {
      email, password
    }
    
    return this.http.post<UserModel>(url, data);
  }

  signup(firstName: String, lastName: String, email: String, password: String) {
    const url = `${environment.baseUrl}/user/registerUser`;
    const data = { email, password, firstName, lastName };
    return this.http.post<UserModel>(url, data);
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
    this.loginSubject.next(true);
  }

  getUser() {
    if (!this.user) {
      const t = localStorage.getItem('user')
      if (t) {
        this.user = JSON.parse(t);
      }
    }
    if (this.user) {
      return this.user;
    }
    return null;
  }

  logout() {
    this.user = null;
    localStorage.removeItem('user');
    this.loginSubject.next(false);
  }

  getProfile(): Observable<UserModel> {
    const url = `${environment.baseUrl}/user/getUserProfile`;
    return this.http.get<UserModel>(url);
  }

  updateProfile(firstName: string, lastName: string, password: string | null, profilePic: File| undefined) : Observable<UserModel> {
    const url = `${environment.baseUrl}/user/updateProfile`;
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    if(password) {
      formData.append('password', password);
    }
    if(profilePic) {
      formData.append('profilePic', profilePic)
    }
    return this.http.post<UserModel>(url, formData);
  }
}

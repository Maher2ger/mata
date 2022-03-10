import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Subject} from 'rxjs';

import { SignupData, LoginData } from "./auth-data.model";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token!:any;
  private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient,
              private router: Router) { }

  getToken():string { return this.token; }

  getIsAuthenticated():boolean { return this.isAuthenticated; }

  getAuthStatusList() { return this.authStatusListner.asObservable(); }

  createUser(name: string, password: string, email: string) {
    const authData: SignupData = {
      name: name,
      email:email,
      password:password
    }
    this.http.post('http://localhost:3000/api/users/signup', authData)
        .subscribe(response => {
          console.log(response);
          this.router.navigate(['/login']);

        })
  }

  loginUser(email: string, password: string) {
      const authData: LoginData = {
          email:email,
          password:password
      }
      this.http.post<{message: string, token: string}>(`http://localhost:3000/api/users/login`, authData)
          .subscribe(response => {

              this.token = response.token;
              if (response.token) {
                  this.isAuthenticated = true;
                  this.authStatusListner.next(true);
                  this.router.navigate(['/']);
              }
          })
  }

  logoutUser() {
      this.token = null;
      this.isAuthenticated = false;
      this.authStatusListner.next(false);
      this.router.navigate(['/login']);

  }
}

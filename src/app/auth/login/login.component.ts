import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
      private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  onLogin(form: NgForm) {
    console.log(form.value);
    this.authService.loginUser(
        form.value.uemail,
        form.value.upassword
        );
  }

}

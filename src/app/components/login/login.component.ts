import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CatmashService } from '../../services/api/catmash.service';
import { SignupData, User } from '../../model/signup_post';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule,MatIconModule,MatFormFieldModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent{
    constructor(private catmashService: CatmashService, private router: Router) {}
      userlogin : User[] = [];
      singup : SignupData[] = [];
   
      async loginuser(username: string, password: string) {
        if (username.trim() === '' || password.trim() === '') {
          alert("Username or password is not provided.");
          return;
        }else{
           this.userlogin = await this.catmashService.LoginUser(username, password);
        if(this.userlogin.length > 0 ){
            this.router.navigate(['']);
        }else{
          alert("Loging failed.");
          }
        }
      }
      
      async signup(name: string, username: string, password: string, comfirmpassword: string) {
        if(password != comfirmpassword){
           alert("กรุณากรอก password กับ comfirmpassword ให้เหมือนกัน");
            return;
        }else if(name.trim() === '' || username.trim() === '' || password.trim() === '' || comfirmpassword.trim() === ''){
          alert("กรุณากรอกให้ถูกต้อง");
          return;
        }
        const type = 'user';
        try {
          this.singup = await this.catmashService.SignupUser(name, username, password, type);
          this.loginuser(username,password);
        } catch (error) {
          console.error('Signup failed:', error);
          alert("Signup failed");
        }
      }
}

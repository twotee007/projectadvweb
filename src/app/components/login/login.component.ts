import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CatmashService } from '../../services/api/catmash.service';
import { SignupData, User } from '../../model/signup_post';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Getimgservice } from '../../services/api/Getimg.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule,MatIconModule,MatFormFieldModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent{
    constructor(private catmashService: CatmashService, private router: Router,private snackBar: MatSnackBar,private fileUploadService : Getimgservice) {}
      userlogin : User[] = [];
      singup : SignupData[] = [];
      image: File | undefined;
      imageUrl : string | undefined;
      async loginuser(username: string, password: string) {
        if (username.trim() === '' || password.trim() === '') {
          this.snackBar.open('Username or password is not provided.', 'Close', {
            verticalPosition: 'top',
            duration: 3000
          });
          return;
        }else{
           this.userlogin = await this.catmashService.LoginUser(username, password);
        if(this.userlogin.length > 0 && this.userlogin[0].type === 'user'){
            localStorage.setItem('user', JSON.stringify(this.userlogin));
            this.router.navigate(['']);
        }else{
          this.snackBar.open('Loging failed.', 'Close', {
            verticalPosition: 'top',
            duration: 3000
          });
          }
        }
      }
      
      async signup(name: string, username: string, password: string, comfirmpassword: string) {
        if(password != comfirmpassword){
            this.snackBar.open('กรุณากรอก password กับ comfirmpassword ให้ถูกต้อง', 'Close', {
                verticalPosition: 'top',
                duration: 3000
            });
            return;
        } else if(name.trim() === '' || username.trim() === '' || password.trim() === '' || comfirmpassword.trim() === ''){
            this.snackBar.open('Please fill out the information completely.', 'Close', {
                verticalPosition: 'top',
                duration: 3000
            });
            return;
        }
        const type = 'user';
        try {
            // ตรวจสอบว่ามีไฟล์ที่ถูกเลือกหรือไม่
            if (this.image) {
                // ส่งไฟล์ไปยัง API เพื่ออัปโหลด
                const file: File = this.image;
                console.log('File uploaded successfully',file);
                this.singup = await this.catmashService.SignupUser(name, username, password, type,file);
                this.loginuser(username,password);
            }
            // ลงทะเบียนผู้ใช้หลังจากที่อัปโหลดไฟล์เสร็จสิ้น;
        } catch (error) {
            console.error('Signup failed:', error);
            alert("Signup failed");
        }
    }
    
    onFileSelected(event: any) {
      const file: File = event.target.files[0];
      this.image = file;
      this.imageUrl = URL.createObjectURL(file);
  }
}

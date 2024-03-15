import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { User } from '../../model/signup_post';
import { Getimgservice } from '../../services/api/Getimg.service';
import { ImgUser } from '../../model/Img';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule,FormsModule,HeaderComponent,MatProgressBarModule,CommonModule,MatProgressSpinnerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  imageuploadUrl: string = "";
  User : User[] = [];
  imgUser : ImgUser[] =[];
  image: File | undefined;
  imageUrl : string | undefined;
  isLoading: boolean = true; 
  constructor(private getimgservice: Getimgservice,private snackBar: MatSnackBar, private router: Router) {}
    ngOnInit(): void {
      this.User = JSON.parse(localStorage.getItem('user')!);
      this.getimgUser(this.User[0].uid)
      
    }
    async getimgUser(Userid : any){
      this.imgUser = await this.getimgservice.GetimgUser(Userid);
      console.log(this.imgUser);
      
    }
    async addimg(name: string, userid: number,){
      this.isLoading = false;
      if(name.trim() === '' ){
        this.snackBar.open('Name undefined', 'Close', {
          verticalPosition: 'top',
          duration: 3000
      });
      return;
      }
      try {
        // ตรวจสอบว่ามีไฟล์ที่ถูกเลือกหรือไม่
        if (this.image) {
            // ส่งไฟล์ไปยัง API เพื่ออัปโหลด
            const file: File = this.image;
            console.log('File uploaded successfully',file);
            const checkimg = await this.getimgservice.insertimg(name,userid,file);
            window.location.reload();
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

    onImageSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        this.imageUrl = imageUrl;
      }
    }
  onuploadImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const imageuploadUrl = URL.createObjectURL(file);
      this.imageuploadUrl = imageuploadUrl;
    }
  }
}

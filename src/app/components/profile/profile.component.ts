import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { User } from '../../model/signup_post';
import { Getimgservice } from '../../services/api/Getimg.service';
import { Getranktoday, ImgUser } from '../../model/Img';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { CatmashService } from '../../services/api/catmash.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule,FormsModule,HeaderComponent,MatProgressBarModule,CommonModule,MatProgressSpinnerModule,RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  imageuploadUrl: string = "";
  oldUser : User[] = [];
  User : User[] = [];
  imgUser : ImgUser[] =[];
  imgUserold : ImgUser[] =[];
  image: File | undefined;
  imageUrl : string | undefined;
  imageuser: File | undefined;
  imageUrluser : string | undefined;
  isLoading: boolean = true; 
  editName: string = '';
  imgcheak : boolean = true;
  cheackname : boolean = true;
  cheackpass : boolean = true;
  cheacknewpass : boolean = true;
  success : boolean = false;
  successimg : boolean = false;
  cheakchange = true;
  todayrank : Getranktoday[] =[];
  yesterdayrank : Getranktoday[] =[];
  rank : Getranktoday[] = [];
  rankold : Getranktoday[] = [];
  constructor(private getimgservice: Getimgservice,private snackBar: MatSnackBar, private router: Router,private catmash : CatmashService) {}
  async ngOnInit(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.User = JSON.parse(userJson);
        this.User = await this.catmash.GetloginUser(this.User[0].uid);
        if (this.User && this.User.length > 0) {
            this.editName = this.User[0].name;
            this.todayrank = await this.getimgservice.GetRanktoday();
            this.yesterdayrank = await this.getimgservice.GetRankyesterday();
            this.getimgUser(this.User[0].uid,this.todayrank,this.yesterdayrank);
        }
    }
  }
  
    async getimgUser(Userid : any,todayrank: Getranktoday[], yesterdayrank: Getranktoday[]){
      for (let i = 0; i < todayrank.length; i++) {
        let ranknow: Getranktoday = { ...todayrank[i] };
        let foundYesterday = false; // เพิ่มตัวแปรเพื่อตรวจสอบว่ามีข้อมูลจาก yesterdayrank หรือไม่
        for(let j=0;j<yesterdayrank.length;j++){
            if(todayrank[i].name === yesterdayrank[j].name){
                ranknow.rankdifferent = yesterdayrank[j].rankingyesterday - todayrank[i].rankingtoday;
                ranknow.rankingyesterday = yesterdayrank[j].rankingyesterday
                this.rankold.push(ranknow);
                foundYesterday = true; // กำหนดค่าเป็น true เมื่อพบข้อมูลจาก yesterdayrank
                break; // หยุดการวนลูปหากพบข้อมูลจาก yesterdayrank
            }
        }
        if (!foundYesterday) {
          ranknow.rankingyesterday = 0;
          this.rankold.push(ranknow);
      }
    
        }
        this.rank = this.rankold.filter(rank => rank.uid === this.User[0].uid);
        console.log("rank",this.rank);
        this.imgUserold = await this.getimgservice.GetimgUser(Userid);
        console.log( this.imgUserold);
        this.getrankuser( this.rank,this.imgUserold);
    }
    getrankuser(rank : Getranktoday[] , imguser :  ImgUser[]){
      for (let i = 0; i < imguser.length; i++) {
        let ranknow: ImgUser = { ...imguser[i] };
        let foundYesterday = false; // เพิ่มตัวแปรเพื่อตรวจสอบว่ามีข้อมูลจาก yesterdayrank หรือไม่
        for(let j=0;j<rank.length;j++){
            if(imguser[i].name === rank[j].name){
                ranknow.rankdifferent = rank[j].rankdifferent;
                ranknow.rankingtoday = rank[j].rankingtoday;
                ranknow.rankingyesterday = rank[j].rankingyesterday;
                this.imgUser.push(ranknow);
                foundYesterday = true; // กำหนดค่าเป็น true เมื่อพบข้อมูลจาก yesterdayrank
                break; // หยุดการวนลูปหากพบข้อมูลจาก yesterdayrank
            }
        }
        if (!foundYesterday) {
          ranknow.rankingtoday = 0;
          ranknow.rankingyesterday = 0;
          this.imgUser.push(ranknow);
      }
        }
      this.successimg = true;
      if(this.imgUser.length >= 5){
        this.successimg = false;
      }
      console.log("ImgUSer",this.imgUser);
    }
    async addimg(name: string, userid: number,){
      if(name.trim() === '' ){
        this.cheackname = false;
      return;
      }
      try {
        this.isLoading = false;
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
    async updateuser(note: string) {
        if(this.imageuser === undefined){
          this.isLoading = false;
          await this.getimgservice.chageusername(this.editName,note,this.User[0].uid);
          window.location.reload();
        }else{
          try {
            this.isLoading = false;
            // ตรวจสอบว่ามีไฟล์ที่ถูกเลือกหรือไม่
            if (this.imageuser) {
                // ส่งไฟล์ไปยัง API เพื่ออัปโหลด
                const file: File = this.imageuser;
                console.log('File uploaded successfully',file);
                await this.getimgservice.chageuser(this.editName,note,this.User[0].uid,this.User[0].image,file);
                window.location.reload();
            }
            // ลงทะเบียนผู้ใช้หลังจากที่อัปโหลดไฟล์เสร็จสิ้น;
        } catch (error) {
            console.error('Signup failed:', error);
            alert("Signup failed");
        }
        }
      }
      async changepass(oldpass: string,newpass: string,confirmnewpass: string,uid: number) {
        if(newpass.trim() === '' && confirmnewpass.trim() === ''){
          this.cheacknewpass = false;
          return;
        }
        if(oldpass === this.User[0].password){
          if(newpass === confirmnewpass){
            let cheack = await this.getimgservice.updatepass(newpass,uid);
            this.success = true;
            setTimeout(() => {
              this.success = false;
          }, 5000); // 3000 milliseconds = 3 seconds
          }else{
            this.cheacknewpass = false;
            return;
          }
        }else{
          this.cheackpass = false;
          return;
        }

        }
        async Deleteimg(imgid: number,uid: number,imgurl: string) {
          this.isLoading = false;
          const cheackdeimg = await this.getimgservice.Deleteimg(imgid,uid);
          if(cheackdeimg){
            const cheackdeurl = await this.getimgservice.Deleteurl(imgurl);
            if(cheackdeurl){
              window.location.reload();
            }else{
              this.isLoading = true;
            }
          }else{
            console.log("ERROR");
            
          }
        }
        async changetimguser(name: string,uid: number,imgurl: string,imgid: number) {
          if(name.trim() === '' ){
            this.cheackname = false;
          return;
          }
          try {
            this.isLoading = false;
            
            if (this.changeimg) {
                // ส่งไฟล์ไปยัง API เพื่ออัปโหลด
                const file: File = this.changeimg;
                console.log('File uploaded successfully',file);
                const checkimg = await this.getimgservice.chageimguser(name,imgid,uid,imgurl,file);
                if(checkimg){
                  window.location.reload();
                }
                
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

    onFileSelectedimguser(event: any) {
      const file: File = event.target.files[0];
      this.imageuser = file;
      this.imageUrluser = URL.createObjectURL(file);
      this.imgcheak = false;
    }
    changeimg: File | undefined;
    changeimgurl : string | undefined;
    currentImgId: number | undefined;
    onFileSelectedimg(event: any, imgId: number) {
      const file: File = event.target.files[0];
      this.changeimg = file;
      this.currentImgId = imgId;
      this.changeimgurl = URL.createObjectURL(file);
      this.cheakchange = false;
    }
}

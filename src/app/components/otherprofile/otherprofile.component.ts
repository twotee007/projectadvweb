import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { User } from '../../model/signup_post';
import { Getimgservice } from '../../services/api/Getimg.service';
import { CatmashService } from '../../services/api/catmash.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { Getranktoday, ImgUser } from '../../model/Img';
import { HeaderadmidComponent } from "../headeradmid/headeradmid.component";
@Component({
    selector: 'app-otherprofile',
    standalone: true,
    templateUrl: './otherprofile.component.html',
    styleUrl: './otherprofile.component.scss',
    imports: [HeaderComponent, MatProgressSpinnerModule, MatProgressBarModule, CommonModule, HeaderadmidComponent]
})
export class OtherprofileComponent implements OnInit {
  constructor(private route: ActivatedRoute,private getimgservice: Getimgservice,private catmash : CatmashService) { }
  uid : number = 0;
  oldUser : User[] = [];
  User : User[] = [];
  Userlogin : User[] = [];
  admin : User[] = [];
  imgUser : ImgUser[] =[];
  imgUserold : ImgUser[] =[];
  todayrank : Getranktoday[] =[];
  yesterdayrank : Getranktoday[] =[];
  rank : Getranktoday[] = [];
  rankold : Getranktoday[] = [];
  isLoggedIn: boolean = false;
  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
       this.uid = params['uid'];
  });
  if(localStorage.getItem('user')){
    this.Userlogin = JSON.parse(localStorage.getItem('user')!);
    console.log("User");
    
  }else if(localStorage.getItem('admin')){
    this.admin = JSON.parse(localStorage.getItem('admin')!);
    console.log("Admin");
  }else{
    
  }
  this.User = await this.getimgservice.GetUser(this.uid);
  if (this.User && this.User.length > 0) {
    this.todayrank = await this.getimgservice.GetRanktoday();
    this.yesterdayrank = await this.getimgservice.GetRankyesterday();
    this.getimgUser(this.User[0].uid,this.todayrank,this.yesterdayrank);
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
  }
  // isAuthenticated(): boolean {
  //   return this.isLoggedIn;
  // }

  // // เมธอดสำหรับเข้าสู่ระบบ
  // login(username: string, password: string): boolean {
  //   // ตรวจสอบข้อมูลการเข้าสู่ระบบ
  //   if (username === 'admin' && password === 'password') {
  //     this.isLoggedIn = true;
  //     return true;
  //   } else {
  //     this.isLoggedIn = false;
  //     return false;
  //   }
  // }

  // // เมธอดสำหรับออกจากระบบ
  // logout(): void {
  //   this.isLoggedIn = false;
  // }
}


import { Component,OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../model/signup_post';
import { CommonModule } from '@angular/common';
import { CatmashService } from '../../services/api/catmash.service';
import { HeaderadmidComponent } from "../headeradmid/headeradmid.component";
import { GetImg } from '../../model/Img';
import { Getimgservice } from '../../services/api/Getimg.service';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-admid',
    standalone: true,
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    imports: [CommonModule, HeaderadmidComponent,RouterModule,FormsModule]
})
export class AdminComponent {
  constructor(private router: Router,private catmach : CatmashService,private getimg : Getimgservice) {}
  Admin : User[] = [];
  Users : User[]= [];
  oldadmin : User[] = [];
  img : GetImg[] = [];
  countdownImgSeconds: number = 10; // เวลานับถอยหลังของรูปภาพเริ่มต้นที่ 10 วินาที
  countdownImg: number = 4; // เวลานับถอยหลังของรูปภาพเริ่มต้นที่ 10 วินาที
  async ngOnInit():Promise<void> {
    if (localStorage.getItem('admin')) {
      this.oldadmin = JSON.parse(localStorage.getItem('admin')!);
      this.Admin = await this.catmach.GetloginUser(this.oldadmin[0].uid);
      console.log( this.Admin);
      
      localStorage.setItem('admin', JSON.stringify(this.Admin));
      this.getimguser();
    }else{
      this.router.navigate(['']);
    }
  }
  async getimguser(){
    this.img =  await this.getimg.Getimg();
    this.Users = await this.catmach.GetUserall();
  }
  onCountdownChange() {
    // ใส่การจัดการเมื่อค่า countdownImgSeconds เปลี่ยนแปลง
    localStorage.setItem('Timeout', this.countdownImgSeconds.toString());
    let remainingTime = localStorage.getItem('Timeout');
    console.log(remainingTime);
    
    
  }
  onCountdown() {
    // ใส่การจัดการเมื่อค่า countdownImgSeconds เปลี่ยนแปลง
    let dom = this.countdownImg * 1000;
    localStorage.setItem('Timevote', dom.toString());
    let remaining = localStorage.getItem('Timevote');
    console.log(remaining);
    
    
  }
  
  
}
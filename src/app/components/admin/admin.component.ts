import { Component,OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../model/signup_post';
import { CommonModule } from '@angular/common';
import { CatmashService } from '../../services/api/catmash.service';
import { HeaderadmidComponent } from "../headeradmid/headeradmid.component";
import { GetImg } from '../../model/Img';
import { Getimgservice } from '../../services/api/Getimg.service';
@Component({
    selector: 'app-admid',
    standalone: true,
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    imports: [CommonModule, HeaderadmidComponent,RouterModule]
})
export class AdmidComponent {
  constructor(private router: Router,private catmach : CatmashService,private getimg : Getimgservice) {}
  Admin : User[] = [];
  Users : User[]= [];
  oldadmin : User[] = [];
  img : GetImg[] = [];
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
  
  
}
import { Component, OnInit } from '@angular/core';
import { User } from '../../model/signup_post';
import { Getimgservice } from '../../services/api/Getimg.service';
import { CommonModule } from '@angular/common';
import { HeaderadmidComponent } from "../headeradmid/headeradmid.component";
import { Router, RouterModule } from '@angular/router';
import { CatmashService } from '../../services/api/catmash.service';
import {MatTooltipModule} from '@angular/material/tooltip'


@Component({
    selector: 'app-userlist',
    standalone: true,
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.scss'], // แก้ styleUrl เป็น styleUrls
    imports: [CommonModule, HeaderadmidComponent, RouterModule,MatTooltipModule]
})
export class UserListComponent implements OnInit {
   users: User[] = []; 
   user: User[] = []; 
   Admin : User[] = [];
   oldadmin : User[] = [];
  constructor(private getimgservice: Getimgservice,private getuser : CatmashService,private router: Router) {}

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('admin')) {
        this.Admin = JSON.parse(localStorage.getItem('admin')!);
        this.loadUsers(); 
      }else{
        this.router.navigate(['']);
      }
  }

  async loadUsers(): Promise<void> {
    this.users = await this.getuser.GetUserall();
  }
}

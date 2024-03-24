import { Component,OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../model/signup_post';
import { CommonModule } from '@angular/common';
import { CatmashService } from '../../services/api/catmash.service';
import { HeaderadmidComponent } from "../headeradmid/headeradmid.component";
@Component({
    selector: 'app-admid',
    standalone: true,
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    imports: [CommonModule, HeaderadmidComponent,RouterModule]
})
export class AdmidComponent {
  constructor(private router: Router,private catmach : CatmashService) {}
  User : User[] = [];
  image: User[] = [];
  oldUser : User[] = [];
  async ngOnInit():Promise<void> {
    if (localStorage.getItem('user')) {
      this.oldUser = JSON.parse(localStorage.getItem('user')!);
      this.User = await this.catmach.GetloginUser(this.oldUser[0].uid);
      localStorage.setItem('user', JSON.stringify(this.User));
    }
  }
  
  
}
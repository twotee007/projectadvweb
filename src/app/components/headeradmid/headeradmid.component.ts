import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CatmashService } from '../../services/api/catmash.service';
import { User } from '../../model/signup_post';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-headeradmid',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './headeradmid.component.html',
  styleUrl: './headeradmid.component.scss'
})
export class HeaderadmidComponent {
  constructor(private router: Router,private catmach : CatmashService) {}
  Admin : User[] = [];
  async ngOnInit():Promise<void> {
    if (localStorage.getItem('admin')) {
      this.Admin = JSON.parse(localStorage.getItem('admin')!);
      this.Admin = await this.catmach.GetloginUser(this.Admin[0].uid);
      console.log( this.Admin);
      
      localStorage.setItem('admin', JSON.stringify(this.Admin));
    }else{
      this.router.navigate(['']);
    }
  }
  Logout() {
    localStorage.removeItem('admin');
    this.router.navigate(['/login']);
  }
}

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
  User : User[] = [];
  oldUser : User[] = [];
  async ngOnInit():Promise<void> {
    if (localStorage.getItem('user')) {
      this.oldUser = JSON.parse(localStorage.getItem('user')!);
      this.User = await this.catmach.GetloginUser(this.oldUser[0].uid);
      localStorage.setItem('user', JSON.stringify(this.User));
    }
  }
  Logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}

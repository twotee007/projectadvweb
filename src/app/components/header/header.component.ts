import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../model/signup_post';
import { CommonModule } from '@angular/common';
import { CatmashService } from '../../services/api/catmash.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router,private catmach : CatmashService) {}
  User : User[] = [];
  async ngOnInit():Promise<void> {
    if (localStorage.getItem('user')) {
      this.User = JSON.parse(localStorage.getItem('user')!);
      this.User = await this.catmach.GetloginUser(this.User[0].uid);
      localStorage.setItem('user', JSON.stringify(this.User));
    }
  }
  Logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  
}

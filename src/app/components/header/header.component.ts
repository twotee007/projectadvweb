import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../model/signup_post';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) {}
  User : User[] = [];
  ngOnInit():void {
    if (localStorage.getItem('user')) {
      this.User = JSON.parse(localStorage.getItem('user')!);
      console.log(this.User);
    }
  }
  Logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

}

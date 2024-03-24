// import { Component, OnInit } from '@angular/core';
// import { User } from '../../model/signup_post';
// import { Getimgservice } from '../../services/api/Getimg.service';
// import { CommonModule } from '@angular/common';
// import { HeaderadmidComponent } from "../headeradmid/headeradmid.component";
// import { Router, RouterModule } from '@angular/router';



// @Component({
//     selector: 'app-userlist',
//     standalone: true,
//     templateUrl: './userlist.component.html',
//     styleUrls: ['./userlist.component.scss'], // แก้ styleUrl เป็น styleUrls
//     imports: [CommonModule, HeaderadmidComponent, RouterModule]
// })
// export class UserListComponent implements OnInit {
//    users: User[] = []; // Declare users array to hold user data

//   constructor(private getimgservice: Getimgservice) {}

//   ngOnInit(): void {
//     this.loadUsers(); // Call loadUsers method when component initializes
//   }

//   loadUsers(): void {
//     this.getimgservice.GetUserall().then((users: User[]) => {
//       this.users = users; // Assign received user data to users array
//     }).catch(error => {
//       console.error('Error loading users:', error);
//     });
//   }
// }

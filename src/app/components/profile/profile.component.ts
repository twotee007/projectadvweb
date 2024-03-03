import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule,FormsModule,HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  imageUrl: string = "";
  imageuploadUrl: string = "";
  ngOnInit(): void {
    this.imageUrl = "https://www.cnet.com/a/img/resize/e0ebf3dc974fce8609d2ba49fa36cf0f93190062/hub/2021/11/29/f566750f-79b6-4be9-9c32-8402f58ba0ef/richerd.png?auto=webp&fit=crop&height=1200&width=1200";
  }
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      this.imageUrl = imageUrl;
    }
  }
  onuploadImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const imageuploadUrl = URL.createObjectURL(file);
      this.imageuploadUrl = imageuploadUrl;
    }
  }
}

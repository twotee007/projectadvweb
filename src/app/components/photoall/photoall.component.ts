import { Component,OnInit } from '@angular/core';
import { Getimgservice } from '../../services/api/Getimg.service';
import { GetImg } from '../../model/Img';
import { Router, RouterModule } from '@angular/router';
import { CatmashService } from '../../services/api/catmash.service';
import { CommonModule } from '@angular/common';
import { User } from '../../model/signup_post';
import { HeaderadmidComponent } from "../headeradmid/headeradmid.component";
import {MatTooltipModule} from '@angular/material/tooltip'
@Component({
    selector: 'app-photoall',
    standalone: true,
    templateUrl: './photoall.component.html',
    styleUrl: './photoall.component.scss',
    imports: [CommonModule, RouterModule, HeaderadmidComponent,MatTooltipModule]
})
export class PhotoallComponent implements OnInit {
  imgs: GetImg[] = []; // เปลี่ยน users เป็น imgs
    Admin: User[] = []; // เปลี่ยน User เป็น Img
    oldadmin: User[] = []; // เปลี่ยน User เป็น Img

    constructor(private getimgservice: Getimgservice, private catmashService: CatmashService, private router: Router) {}

    async ngOnInit(): Promise<void> {
        if (localStorage.getItem('admin')) {
            this.Admin = JSON.parse(localStorage.getItem('admin')!);
            this.loadImages();
        } else {
            this.router.navigate(['']);
        }
    }

    async loadImages(): Promise<void> {
        this.imgs = await this.getimgservice.Getimg();
    }
}

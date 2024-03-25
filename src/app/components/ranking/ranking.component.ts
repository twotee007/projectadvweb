import { Component, OnInit } from '@angular/core';
import { Getimgservice } from '../../services/api/Getimg.service';
import { HeaderComponent } from '../header/header.component';
import { NgFor } from '@angular/common';
import { Getranktoday } from '../../model/Img';
import { CommonModule } from '@angular/common';
import { User } from '../../model/signup_post';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-ranking',
    standalone: true,
   
  imports: [HeaderComponent,NgFor,CommonModule,RouterModule],
    templateUrl: './ranking.component.html',
    styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
    playerRankings: any[] = []; // ประกาศตัวแปรสำหรับเก็บข้อมูลผู้เล่นและอันดับ
    todayrank : Getranktoday[] =[];
    yesterdayrank : Getranktoday[] =[];
    rank : Getranktoday[] = [];
    rankold : Getranktoday[] = [];
    selectedPlayer: any;
    User : User[] = [];
    constructor(private getimgservice: Getimgservice,private router: Router) {}

    ngOnInit(): void {
        this.loadPlayerRankings(); // เรียกเมธอดเมื่อคอมโพเนนต์ถูกโหลด
        this.User = JSON.parse(localStorage.getItem('user')!);
    }

    async loadPlayerRankings() {
        this.todayrank = await this.getimgservice.GetRanktoday();
        this.yesterdayrank = await this.getimgservice.GetRankyesterday();
        console.log('Today',this.todayrank);
        console.log("Yesterday",this.yesterdayrank);
        this.updaterank(this.todayrank,this.yesterdayrank);
        
    }
    updaterank(todayrank: Getranktoday[], yesterdayrank: Getranktoday[]): void {
        for (let i = 0; i < todayrank.length; i++) {
            let ranknow: Getranktoday = { ...todayrank[i] };
            let foundYesterday = false; // เพิ่มตัวแปรเพื่อตรวจสอบว่ามีข้อมูลจาก yesterdayrank หรือไม่
            for (let j = 0; j < yesterdayrank.length; j++) {
                if (todayrank[i].name === yesterdayrank[j].name) {
                    ranknow.rankdifferent = yesterdayrank[j].rankingyesterday - todayrank[i].rankingtoday;
                    ranknow.rankingyesterday = yesterdayrank[j].rankingyesterday;
                    this.rankold.push(ranknow);
                    foundYesterday = true; // กำหนดค่าเป็น true เมื่อพบข้อมูลจาก yesterdayrank
                    break; // หยุดการวนลูปหากพบข้อมูลจาก yesterdayrank
                }
            }
            if (!foundYesterday) {
                this.rankold.push(ranknow);
            }
        }
        this.rank = this.rankold.slice(0, 10);
        console.log(this.rank);
        }
        lookuser(uid: number) {
            this.router.navigate(['otherprofile'], { queryParams: { uid: uid } });
        }
}


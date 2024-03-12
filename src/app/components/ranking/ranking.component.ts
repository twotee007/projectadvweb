import { Component, OnInit } from '@angular/core';
import { Getimgservice } from '../../services/api/Getimg.service';
import { HeaderComponent } from '../header/header.component';
import { NgFor } from '@angular/common';
import { Getranktoday } from '../../model/Img';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ranking',
    standalone: true,
   
  imports: [HeaderComponent,NgFor,CommonModule],
    templateUrl: './ranking.component.html',
    styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
    playerRankings: any[] = []; // ประกาศตัวแปรสำหรับเก็บข้อมูลผู้เล่นและอันดับ
    todayrank : Getranktoday[] =[];
    yesterdayrank : Getranktoday[] =[];
    rank : Getranktoday[] = [];
    selectedPlayer: any;
    constructor(private getimgservice: Getimgservice) {}

    ngOnInit(): void {
        this.loadPlayerRankings(); // เรียกเมธอดเมื่อคอมโพเนนต์ถูกโหลด
       
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
            const todayItem = todayrank[i];
            
            // หา index ของ todayItem ใน yesterdayrank โดยใช้ชื่อ
            const matchingIndex = yesterdayrank.findIndex(item => item.name === todayItem.name);
        
            // ถ้าเจอ item ที่ตรงกัน
            if (matchingIndex !== -1) {
                const yesterdayItem = yesterdayrank[matchingIndex];
        
                // สร้าง object เพื่อเก็บผลลัพธ์
                const ranknow: Getranktoday = {
                    ...todayItem,
                    rankdifferent: yesterdayItem.rankingyesterday - todayItem.rankingtoday,
                    rankingyesterday: yesterdayItem.rankingyesterday
                };
        
                // เก็บผลลัพธ์ใน this.rank
                this.rank.push(ranknow);
            }
        }
        console.log(this.rank);
    }
    onSelectPlayer(player: any) {
        this.selectedPlayer = player;
      }
      onMouseLeave() {
        this.selectedPlayer = null;
    }
    }


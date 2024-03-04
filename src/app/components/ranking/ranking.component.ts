import { Component, OnInit } from '@angular/core';
import { Getimgservice } from '../../services/api/Getimg.service';
import { HeaderComponent } from '../header/header.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-ranking',
    standalone: true,
   
  imports: [HeaderComponent,NgFor],
    templateUrl: './ranking.component.html',
    styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
    playerRankings: any[] = []; // ประกาศตัวแปรสำหรับเก็บข้อมูลผู้เล่นและอันดับ

    constructor(private getimgservice: Getimgservice) {}

    ngOnInit(): void {
        this.loadPlayerRankings(); // เรียกเมธอดเมื่อคอมโพเนนต์ถูกโหลด
    }

    loadPlayerRankings() {
    // เรียกเมธอดในเซอร์วิสเพื่อดึงข้อมูลผู้เล่นและอันดับ
    this.getimgservice.Getimg().then((data: any[]) => {
        // เรียงลำดับคะแนนจากมากไปน้อย
        data.sort((a, b) => b.score - a.score);
        // จำกัดจำนวนข้อมูลเฉพาะ 10 อันดับแรก
        this.playerRankings = data.slice(0, 10);
    }).catch(error => {
        console.error('Error loading player rankings:', error);
    });
}

}

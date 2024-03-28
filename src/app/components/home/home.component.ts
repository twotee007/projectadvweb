import { Component,NgZone  } from '@angular/core';
import { CommonModule, getLocaleDateFormat, getLocaleDateTimeFormat } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { HeaderComponent } from '../header/header.component';
import { Getimgservice } from '../../services/api/Getimg.service';
import { GetImg } from '../../model/Img';
import { Router } from '@angular/router';
import { User } from '../../model/signup_post';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule,MatCardModule,HeaderComponent,MatProgressSpinnerModule,MatProgressBarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
      ngZone: any;

      constructor(private router: Router , private getimg : Getimgservice,private dialog: MatDialog) {}
      allimg : GetImg[] = [];
      imgran : GetImg[] = [];
      selectedImages: GetImg[] = [];
      votedImages: GetImg[] = [];
      imgwinner : GetImg[] = [];
      imgloser : GetImg[] = [];
      votedImagesIds: Set<number> = new Set<number>();
      totalImages: number = 0;
      votedImagesCount: number = 0;
      countdownSeconds: number = 0;
      show : boolean = true;
      isLoading: boolean = true; 
      countdownimg: number = 0;
      ngOnInit():void {
        this.loadImg();
      }
      async loadImg(){
        if (localStorage.getItem('votedImagesIds')) {
          const votedImagesIds = JSON.parse(localStorage.getItem('votedImagesIds')!);
          this.votedImagesIds = new Set<number>(votedImagesIds);
          
          const votedImagesCountString = localStorage.getItem('votedImagesCount');
          if(votedImagesCountString){
            this.votedImagesCount = parseInt(votedImagesCountString, 10);
            console.log("cont",this.votedImagesCount);
          }
        }
        this.allimg = this.shuffleImages(await this.getimg.Getimg());
        this.totalImages = Math.floor(this.allimg.length/2);
        let remainingTime = localStorage.getItem('remainingTime');
        
        if (!remainingTime) {
            this.loadNextImages();
              this.isLoading = false;
              setTimeout(() => {
                this.loadNextImages();
                this.isLoading = true;
            }, 2000); // 3000 milliseconds = 3 seconds
              this.show = true;
        } else {
          this.countdomn();
        }
        
      }

      loadNextImages() {
        const remainingImages = this.allimg.filter(img => !this.votedImagesIds.has(img.imgid));
        this.isLoading = true;
        if (remainingImages.length >= 2) {
          this.imgran = this.shuffleImages(remainingImages);
          this.selectedImages =  this.imgran.slice(0,2);
        } else {
          this.loadImg();
        }
      }

      shuffleImages(images: GetImg[]) {
        let currentIndex = images.length;
        let randomIndex: number;
        while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          // สลับรูปภาพที่ถูกสุ่มมา
          [images[currentIndex], images[randomIndex]] = [images[randomIndex], images[currentIndex]];
        }
    
        return images;
      }
      onImageClick(winnerIndex: number) { 
        const winnerImage = this.selectedImages[winnerIndex]; 
        const loserIndex = winnerIndex === 0 ? 1 : 0;
        const loserImage = this.selectedImages[loserIndex];

        if (this.votedImagesIds.has(winnerImage.imgid) || this.votedImagesIds.has(loserImage.imgid)) {
          alert('ไม่สามารถโหวตรูปเดิมได้');
          return;
        }
        this.imgwinner.pop();
        this.imgloser.pop();
        winnerImage.isWinner = true;
        loserImage.isLoser = false;

        const expectedWinnerProbability = this.getExpectedScore(winnerImage.score, loserImage.score);
        const expectedLoserProbability = this.getExpectedScore(loserImage.score, winnerImage.score);
        this.updateElo(winnerImage, loserImage, expectedWinnerProbability,expectedLoserProbability);

        this.votedImagesIds.add(winnerImage.imgid);
        this.votedImagesIds.add(loserImage.imgid);
        localStorage.setItem('votedImagesIds', JSON.stringify(Array.from(this.votedImagesIds)));
        this.votedImagesCount += 1;
        localStorage.setItem('votedImagesCount', this.votedImagesCount.toString());
        let remaining = localStorage.getItem('Timevote');
        if(!remaining){
          this.countdownimg = 4000;
        }else{
          this.countdownimg = parseInt(remaining);
        }
        if (this.votedImagesCount === this.totalImages) {
          this.countdomn();
        }else {
          this.isLoading = false;
          setTimeout(() => {
              this.loadNextImages();
          },  this.countdownimg); // 3000 milliseconds = 3 seconds
      }
      }
      countdomn(){
        console.log('โหวตครบทุกรูปแล้ว');
        this.show = false;

        let remainingTime = localStorage.getItem('remainingTime');
        if (!remainingTime) {
            let remainiingTime = localStorage.getItem('Timeout');
            if (remainiingTime !== null) {
                this.countdownSeconds = parseInt(remainiingTime);
            } else {
                this.countdownSeconds = 10;
            }
        } else {
            this.countdownSeconds = parseInt(remainingTime);
        }

        const intervalId = setInterval(() => {
            this.countdownSeconds--;

            if (this.countdownSeconds < 0) {
                clearInterval(intervalId);
                console.log('นับถอยหลังเสร็จสิ้น');
                this.votedImagesIds.clear();
                localStorage.removeItem('votedImagesIds');
                this.votedImagesCount = 0;
                localStorage.removeItem('votedImagesCount');
                localStorage.removeItem('remainingTime');
                this.loadImg();
            } else {
                localStorage.setItem('remainingTime', this.countdownSeconds.toString());
            }
        }, 1000);
      }
      calculateKFactor(rating: number) {
        if (rating >= 0 && rating <= 600) {
          return 25;
        } else if (rating >= 601 && rating <= 2400) {
          return 15;
        } else if (rating >= 2401 && rating <= 3000) {
          return 10;
        } else if (rating > 3000) {
          return 5;
        } else {
          return 32; 
        }
      }

      getExpectedScore(ratingA: number, ratingB: number) {
        return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
      }

      async updateElo(winner: GetImg, loser: GetImg, expectedwinProbability: number,expectedLoserProbability : number) {
        const actualWinnerProbability = 1; // ผลการโหวตจริง (คือชนะ)
        const actualLoserProbability = 0; // ผลการโหวตจริง (คือชนะ)
        const kFactorWinner = this.calculateKFactor(winner.score); // นำเข้าค่า K Factor ตามคะแนนปัจจุบันของ winner
        const kFactorLoser = this.calculateKFactor(loser.score); // นำเข้าค่า K Factor ตามคะแนนปัจจุบันของ loser
      
        // คำนวณคะแนนใหม่สำหรับ winner และ loser
        const winnerNewRating = Math.round(kFactorWinner * (actualWinnerProbability - expectedwinProbability));
        const loserNewRating = Math.round(kFactorLoser * (actualLoserProbability - expectedLoserProbability));
        const winnerra = kFactorWinner * (actualWinnerProbability - expectedwinProbability);
        this.imgwinner.push(winner);
        this.imgloser.push(loser);
        const winnerpop = "1 / ( 1 + 10 **(("+loser.score+" - "+winner.score+") / 400)) = "+ expectedwinProbability.toFixed(2);
        const pointpop = kFactorWinner+" * (1 - "+expectedwinProbability.toFixed(2)+") = "+winnerra.toFixed(2);

        this.openDialog(winner.score, winner.imgurl, winnerNewRating ,winner.name,winnerpop,pointpop,loser.score,kFactorWinner,kFactorLoser);
        const checkwinner = await this.getimg.InsertVote(winner.uid, winner.imgid, winnerNewRating, winner.isWinner);
        if (checkwinner === true) {
            winner.score = winnerNewRating + winner.score;
            await this.getimg.Updateimg(winner.imgid, winner.score);
        }
        
        const checkloser = await this.getimg.InsertVote(loser.uid, loser.imgid, loserNewRating, loser.isLoser);
        if (checkloser === true) {
            loser.score = loserNewRating + loser.score;
            await this.getimg.Updateimg(loser.imgid, loser.score);
        }
        
      }
      openDialog(winnerScore: number, winnerImageSrc: string, winnerrat: number 
                 , winnername : string, winnerpop : string , pointpop : string
                 ,loserScore : number,kFactorWinner : number,kFactorLoser : number): void {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '670px',
          height : '670px', // ปรับเปลี่ยนขนาดตามความต้องการ
          data: { winnerScore: winnerScore, winnerImageSrc: winnerImageSrc
                  , Winnerrat: winnerrat, winnername : winnername, winnerpop:winnerpop
                  ,pointpop:pointpop,loserScore:loserScore,kFactorWinner:kFactorWinner,kFactorLoser:kFactorLoser }// ส่ง array ข้อมูลไปให้ Dialog
        });
      
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          // สามารถเพิ่มโค้ดที่ต้องการทำหลังจากปิด Dialog ได้
        });
      }
      
}

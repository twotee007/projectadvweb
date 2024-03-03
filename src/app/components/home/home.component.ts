import { Component } from '@angular/core';
import { CommonModule, getLocaleDateFormat, getLocaleDateTimeFormat } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { HeaderComponent } from '../header/header.component';
import { Getimgservice } from '../../services/api/Getimg.service';
import { GetImg } from '../../model/Img';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule,MatCardModule,HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

      constructor(private router: Router , private getimg : Getimgservice) {}
      allimg : GetImg[] = [];
      selectedImages: GetImg[] = [];
      votedImages: GetImg[] = [];
      imgwinner : GetImg[] = [];
      imgloser : GetImg[] = [];
      votedImagesIds: Set<number> = new Set<number>();
      totalImages: number = 0;
      votedImagesCount: number = 0;
      countdownSeconds: number = 0;
      show : boolean = true;
      ngOnInit():void {
        this.loadImg();
      }

      async loadImg(){
        this.allimg = this.shuffleImages(await this.getimg.Getimg());
        this.totalImages = this.allimg.length;
        this.loadNextImages();
        this.show = true;
      }

      loadNextImages() {
        const remainingImages = this.allimg.filter(img => !this.votedImagesIds.has(img.imgid));
      
        if (remainingImages.length >= 2) {
          this.selectedImages = this.shuffleImages(remainingImages.slice(0, 2));
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
      onImageClick(winnerIndex: number) { //1
        const winnerImage = this.selectedImages[winnerIndex]; // 1
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

        const expectedWinnerProbability = this.calculateExpectedProbability(winnerImage.score, loserImage.score);
        this.updateElo(winnerImage, loserImage, expectedWinnerProbability);

        this.votedImagesIds.add(winnerImage.imgid);
        this.votedImagesIds.add(loserImage.imgid);
        this.votedImagesCount += 2;

        if (this.votedImagesCount === this.totalImages) {
          console.log('โหวตครบทุกรูปแล้ว');
          this.show = false;
          this.countdownSeconds = 5; // กำหนดเวลานับถอยหลังให้เริ่มต้นที่ 5 วินาที
          const intervalId = setInterval(() => {
            this.countdownSeconds--;
      
            if (this.countdownSeconds < 0) {
              clearInterval(intervalId);
              console.log('นับถอยหลังเสร็จสิ้น');
              this.votedImagesCount = 0;
              this.votedImagesIds.clear();
              this.loadImg();
            }
          }, 1000); // นับถอยหลังทุก 1000 มิลลิวินาที (1 วินาที)
          return;
        } else {
          this.loadNextImages();
        }

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
      calculateExpectedProbability(ratingA: number, ratingB: number) {
        return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400)); //ค่าความคาดหวังเหมือนมึงคาดหวังแล้วเป็นได้แค่พี่น้อง
      }
      async updateElo(winner: GetImg, loser: GetImg, expectedProbability: number) {
        const actualWinnerProbability = 1; // ผลการโหวตจริง (คือชนะ)
        const kFactorWinner = this.calculateKFactor(winner.score); // นำเข้าค่า K Factor ตามคะแนนปัจจุบันของ winner
        const kFactorLoser = this.calculateKFactor(loser.score); // นำเข้าค่า K Factor ตามคะแนนปัจจุบันของ loser
      
        // คำนวณคะแนนใหม่สำหรับ winner และ loser
        const winnerNewRating = Math.round(kFactorWinner * (actualWinnerProbability - expectedProbability));
        const loserNewRating = Math.round(kFactorLoser * ((actualWinnerProbability - 1) - expectedProbability));
        console.log("winnerNewRating : "+winnerNewRating);
        console.log("loserNewRating : "+loserNewRating);        

        this.imgwinner.push(winner);
        this.imgloser.push(loser);
        console.log(this.imgwinner);
        console.log(this.imgloser);

        const checkwinner = await this.getimg.InsertVote(winner.uid,winner.imgid,winnerNewRating,winner.isWinner);
        const checkloser  = await this.getimg.InsertVote(loser.uid,loser.imgid,loserNewRating,loser.isLoser);
        
        winner.score = winnerNewRating + winner.score;
        loser.score = loserNewRating + loser.score;
        if(checkwinner === true && checkloser === true){
          await this.getimg.Updateimg(winner.imgid,winner.score);
          await this.getimg.Updateimg(loser.imgid,loser.score);
        }
        console.log("loser : ",loserNewRating);
      }
      
}

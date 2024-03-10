import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { VoteImg } from '../../model/Img';
import { Getimgservice } from '../../services/api/Getimg.service';
import { User } from '../../model/signup_post';
import { Chart } from 'chart.js/auto'; // Change this import statement
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [HeaderComponent,CommonModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'], 
})
export class GraphComponent implements OnInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  imgIds: any;
  constructor(private getimgservice: Getimgservice) {}
  User: User[] = [];
  getimg : VoteImg[] = [];
  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('user')) {
      this.User = JSON.parse(localStorage.getItem('user')!);
      console.log(this.User);
    }
    this.getimg = await this.getimgservice.GetGraph(this.User[0].uid);
    console.log(this.getimg);
    this.graph(this.getimg);
  }
  graph(imggrap: VoteImg[]) {
    for (let i = 0; i < imggrap.length; i++) {
      const id = `myChart${imggrap[i].imgid}`; // ตรวจสอบให้แน่ใจว่า id แต่ละตัวมีความเฉพาะ
      const existingCanvas = document.getElementById(id);
  
      // Reset labels and data arrays for each iteration
      const labels = [];
      const data = [];
  
      if (!existingCanvas) {
        const voteDateArray = imggrap[i].voteDate.split(',');
        const totalScoreArray = imggrap[i].totalScore.split(',').map(Number);
  
        for (let j = 0; j < Math.min(voteDateArray.length, totalScoreArray.length); j++) {
          labels.push(voteDateArray[j]);
          data.push(totalScoreArray[j]);
        }
  
        const canvasContainer = document.createElement('div');
        canvasContainer.style.width = '600px';
        canvasContainer.style.height = '300px';
        canvasContainer.style.marginBottom = '50px';

        const canvas = document.createElement('canvas');
        canvas.id = id;
        canvasContainer.appendChild(canvas);

        this.chartContainer.nativeElement.appendChild(canvasContainer);
      }
  
      new Chart(id, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: imggrap[i].name,
              data: data,
              borderWidth: 1,
            },
          ],
        },
        options: {
          aspectRatio: 0, // ปรับตามที่ต้องการ
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }


}

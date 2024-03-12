import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { VoteImg } from '../../model/Img';
import { Getimgservice } from '../../services/api/Getimg.service';
import { User } from '../../model/signup_post';
import { Chart } from 'chart.js/auto';
import { CommonModule, formatDate } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// import { format } from 'mysql';
@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [HeaderComponent, CommonModule,RouterModule ],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;

  getimg: VoteImg[] = [];
  isLoading: boolean = true;

  constructor(private getimgservice: Getimgservice ,private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      const user = JSON.parse(localStorage.getItem('user')!);
      if (user) {
        this.getimg = await this.getimgservice.GetGraph(user[0].uid);
        console.log('getimg:', this.getimg);
        this.ngAfterViewInit();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false; // Set loading state to false when data loading is complete
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.getimg && this.getimg.length > 0) {
        this.createCharts();
      }
    }, 0);
  }

  createCharts(): void {
    for (const img of this.getimg) {
      const id = `myChart${img.imgid}`;
      const existingCanvas = document.getElementById(id) as HTMLCanvasElement;
     
      
      if (!existingCanvas) {
        console.error(`Canvas element with id '${id}' not found.`);
        continue; // Skip to the next iteration if canvas element is not found
      }
      const currentDate = new Date();
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 6);

      const voteDateArray = img.voteDate.split(',');
      const totalScoreArray = img.totalScore.split(',').map(Number);
  
      const labels = this.generateDateLabels(sevenDaysAgo);
      // const data = totalScoreArray;
      // const labels = voteDateArray;
      const data = this.generateDataArray(voteDateArray, totalScoreArray, sevenDaysAgo);
  
      new Chart(existingCanvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'คะแนนในแต่ละวัน',
              data: data,
              borderWidth: 2,
              pointRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            title: {
              display: true,
            },
          },
        },
      });
    }
  }
  generateDateLabels(sevenDaysAgo: Date): string[] {
  const labels = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + i);
    labels.push(date.toISOString().split('T')[0]);
  }
  return labels;
}
generateDataArray(voteDateArray: string[], totalScoreArray: number[], sevenDaysAgo: Date): number[] {
  const data = [];

  for (let i = 0; i < 6; i++) {
    const currentDate = new Date(sevenDaysAgo);
    currentDate.setDate(sevenDaysAgo.getDate() + i);

    const index = voteDateArray.indexOf(currentDate.toISOString().split('T')[0]);
    if (index !== -1) {
      data.push(totalScoreArray[index]);
    } else {
      data.push(0);
    }
  }

  return data;
}
}

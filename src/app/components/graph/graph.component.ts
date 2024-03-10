import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { VoteImg } from '../../model/Img';
import { Getimgservice } from '../../services/api/Getimg.service';
import { User } from '../../model/signup_post';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;

  getimg: VoteImg[] = [];

  constructor(private getimgservice: Getimgservice) {}

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
  
      const voteDateArray = img.voteDate.split(',');
      const totalScoreArray = img.totalScore.split(',').map(Number);
  
      const labels = voteDateArray;
      const data = totalScoreArray;
  
      new Chart(existingCanvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'คะแนน +',
              data: data,
              borderWidth: 1,
              pointRadius: 10,
            },
            {
              label: 'คะแนน -',
              data: [100,200,300],
              borderWidth: 1,
              pointRadius: 10,
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
              text: img.name,
            },
          },
        },
      });
    }
  }
}  
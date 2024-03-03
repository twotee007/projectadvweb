import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule,MatCardModule,HeaderComponent],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent {
  samplePlayers: any[] = [];

  constructor() { }

  ngOnInit(): void {
    // สร้างข้อมูลตัวอย่างของผู้เล่น
    this.samplePlayers = this.generateSamplePlayers(10);
  }

  generateSamplePlayers(count: number): any[] {
    const players = [];
    for (let i = 1; i <= count; i++) {
      const randomElo = this.getRandomElo();
      const player = {
        id: i,
        name: `Player ${i}`,
        imageUrl: `https://picsum.photos/200/300?random=${i}`,
        eloRating: randomElo
      };
      players.push(player);
    }
    
    // Sort players by eloRating in descending order
    players.sort((a, b) => b.eloRating - a.eloRating);
    
    return players;
  }

  getRandomElo(): number {
    // สุ่มคะแนน Elo ระหว่าง 1000 ถึง 2000
    return Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
  }
}

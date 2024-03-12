import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  styleUrl: './home.component.scss',
  selector: 'app-your-dialog',
  template: `
<div class="d-flex justify-content-center align-items-center" [@slideIn]="true">
  <div class="text-center" style="width: 100%;">
    <h1 mat-dialog-title>{{data.winnername}} Winner!!!</h1>
    <img [src]="data.winnerImageSrc" alt="Winner Image" style="width: 400px; display: block; margin: 0 auto; border-radius: 15px;">
    <h4>Winner Score: {{data.winnerScore }} + {{data.Winnerrat}} => {{data.winnerScore + data.Winnerrat}}</h4>
  </div>
</div>
  `,
})
export class DialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { winnerScore: number , winnerImageSrc: string, Winnerrat : number ,winnername : string}
  ) {}
  ngOnInit() {
    // หลังจาก 3 วินาที ปิดป้อบอัพ
    setTimeout(() => {
      this.dialogRef.close();
    }, 3000);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  styleUrl: './home.component.scss',
  selector: 'app-your-dialog',
  template: `
<div class="d-flex justify-content-center align-items-center" [@slideIn]="true">
  <div class="text-center" style="width: 100%;">
    <h1 mat-dialog-title>{{data.winnername}} Winner!!!</h1>
  <img [src]="data.winnerImageSrc" alt="Winner Image" class="equal-image">
    <h3>Chance Win</h3>
    <h5>RWinng : <span class="red-text">{{data.winnerScore}}</span> | RLoser : <span class="red-text">{{data.loserScore}}</span></h5>
    <h5>kFactorWinner : <span class="red-text">{{data.kFactorWinner}}</span> | kFactorLoser : <span class="red-text">{{data.kFactorLoser}}</span></h5>
    <h5 class="red-text">{{data.winnerpop}}</h5>
    <h3>Points</h3>
    <h5 class="red-text">{{data.pointpop}}</h5>
    <h5 class="red-text"><span>{{data.winnerScore}}</span> + {{data.Winnerrat}}</h5>
    <h3>Newscore => <span class="red-text">{{data.winnerScore + data.Winnerrat}}</span></h3>
  </div>
</div>
  `,
})
export class DialogComponent  {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { winnerScore: number , winnerImageSrc: string
                                            , Winnerrat : number ,winnername : string,winnerpop :string 
                                            , pointpop:string,loserScore:number,kFactorWinner:number,kFactorLoser:number}
  ) {}
  // ngOnInit() {
  //   // หลังจาก 3 วินาที ปิดป้อบอัพ
  //   setTimeout(() => {
  //     this.dialogRef.close();
  //   }, 3000);
  // }
  // onNoClick(): void {
  //   this.dialogRef.close();
  // }
}

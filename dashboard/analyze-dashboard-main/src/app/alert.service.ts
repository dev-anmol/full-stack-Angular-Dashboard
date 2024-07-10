import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSound = new Audio('assets/alert.wav');

  constructor() { }

  checkValue(value:number, threshold:number):void{
    if(value>threshold){
      this.playAlert();
    }
  }
  private playAlert():void{
    this.alertSound.play();
  }
}

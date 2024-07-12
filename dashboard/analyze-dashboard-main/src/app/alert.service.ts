import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSounds: { [key: number]: HTMLAudioElement } = {
    1: new Audio('assets/alert.wav'),
    3: new Audio('assets/alert3.wav'),
    4: new Audio('assets/alert4.wav'),
    5: new Audio('assets/alert5.wav')
  };
  alertCheck: boolean = false;

  constructor() {
    Object.values(this.alertSounds).forEach(audio => audio.load());
  }

  checkThreshold(value: number, threshold: number): boolean {
    this.alertCheck = value > threshold;
    return this.alertCheck;
  }

  checkValue(value: number, threshold: number, deviceId: number): boolean {
    if (this.checkThreshold(value, threshold)) {
      const audio = this.alertSounds[deviceId];
      if (audio) {
        audio.play().catch(error => console.error('Error playing audio:', error));
        return true;
      } else {
        console.warn(`No audio found for device ID ${deviceId}`);
      }
    }
    return false;
  }
}
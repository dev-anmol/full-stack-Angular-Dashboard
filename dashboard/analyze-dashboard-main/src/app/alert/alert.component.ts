import { Component } from '@angular/core';
import { AlertService } from '../alert.service';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  parameterValue: number | null = null;
  deviceId: number | null = null;
  threshold: number = 0.00001;
  isAlert: boolean = false;

  constructor(private alertService: AlertService, private dataService: DataService) { }

  fetchData(): void {
    if (this.deviceId === null) {
      console.warn('Device ID is not set');
      return;
    }

    this.dataService.fetchData(this.deviceId).subscribe(
      (data) => {
        this.parameterValue = data[this.deviceId!].KW;
        console.log('Parameter value:', this.parameterValue);
        if (this.parameterValue !== null) {
          this.checkParameter();
        }
      },
      (error) => {
        console.error("Error fetching data from the database", error);
        alert('No data found in the database');
      }
    );
  }

  checkParameter(): void {
    if (this.parameterValue !== null && this.deviceId !== null) {
      this.isAlert = this.alertService.checkValue(this.parameterValue, this.threshold, this.deviceId);
      console.log('Is alert:', this.isAlert);
    }
  }
}
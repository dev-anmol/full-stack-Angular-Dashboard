import { Component } from '@angular/core';
import { AlertService } from '../alert.service';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  parameterValue: any;
  id: number = 1;
  data: any;
  deviceId: number = 1;
  threshold:number = 0.0001;
  constructor(private alertService: AlertService, private dataService: DataService) { }

  
  fetchData(): any {
    this.dataService.fetchData(this.deviceId).subscribe(
      (data) => {
        this.data = data;
        this.parameterValue = data[this.deviceId].KW;
        console.log(this.parameterValue);
        if (this.parameterValue) {
          this.checkParameter();
        }
      },
      (error) => {
        console.log("Error fetching data from the database", error);
        alert('no data found in the database')
      }

    )

  }
  checkParameter(): void {
    this.alertService.checkValue(this.parameterValue, this.threshold)
  }
}

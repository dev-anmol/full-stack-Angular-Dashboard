import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { BodyComponent } from './body/body.component';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatepickerComponent } from './datepicker/datepicker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, BodyComponent, HttpClientModule, SidebarComponent, ModalModule, DialogContentComponent, MatDatepicker, DatepickerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dashboard';
}

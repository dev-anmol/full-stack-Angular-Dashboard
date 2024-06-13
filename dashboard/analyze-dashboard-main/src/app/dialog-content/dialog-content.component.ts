import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormService } from '../form.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MatDialogModule, CommonModule, NgMultiSelectDropDownModule, FormsModule],
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})
export class DialogContentComponent {

  constructor(private formDataService: FormService){};


  radioValue: string = 'Parameter';
  selectedOption: any;
  selectedParameter: any[] = [];
  PFacility:any;
  PDevice:any;
  PParameter:any;
  PGraphType:any;
  PPlotAxis:any;

  BFacility:any;
  BDevice:any;
  BBenchMark:any;
  BPlotAxis:any;

  SFacility:any;
  SDevice:any;
  SParameter:any;
  SGraphType:any;
  SPlotAxis:any;

  KFacility:any;
  Kpi:any;






  parameters: string[] = [
    'A (A)', 'I(Y) (A)', 'I(B) (A)', 'VLL (V)', 'VLN (V)', 'V(RY) (V)', 'V(YB) (V)', 'V(BR) (V)', 'V(R) (V)', 'V(Y) (V)', 'V(B) (V)', 'KW (KW)', 'KW(R) (KW)', 'KW(Y) (KW)', 'KW(B) (KW)', 'KVA(KVA)', 'KVA(R)(KVA)', 'KVA(Y)(KVA)', 'KVA(B)(KVA)', 'KVAr(KVAr)', 'KVAr(R)(KVAr)', 'KVAr(Y)(KVAr)', 'KVAr(B)(KVAr)', 'KWh(KWh)', 'KWh(G)(KWh)', 'KWh(Revieved)(KWh)', 'KVAh(KVAh)', 'KVAh(G)(KVAh)', 'KVAh(Received)(KVAh)', 'KVArh(KVArh)', 'KVArh(Recieved) (KVArh)', 'KWh(KWh)', 'F(Hz)', 'PF(-)', 'PF(R)(-)', 'PF(Y)(-)', 'PF(B)(-)', 'THDi(R)(%)', 'THDi(Y)(%)', 'THDI(B)(%)', 'THDin(%)', 'THDig(%)', 'THDv(%)', 'THDv(RY)(%)', 'THDv(YB)(%)', 'THDv(BR)(%)', 'THDv(R)(%)', 'THDv(Y)(%)', 'THDv(B)(%)', 'THDvln(%)', 'TDD(-)', 'PresentDemand(KW)(KW)', 'PresentDemand(KVA)(KVA)', 'PresentDemand(KVAr)(KVAr)', 'PeakDemand(KW)(KW)', 'PeakDemand(KVA)(KVA)', 'PeakDemand(KVAr)(KVAr)', 'Percentage Loading (KW) (%)', 'Rising Demand (KW) (KW)', 'OnHours(Hrs)', 'RunHours(Hrs)', 'UnbalancedLoad(KW)', 'CurrentUnbalanced(%)', 'VoltageUnbalanced(%)', 'VLNUnbalanced(%)', 'VLNUnbalanced(-)', 'WindingTempRise(%)', 'Temperature(degC)', 'Pressure(KG/Cm3)', 'Flow(L/s)', 'Humidity(%)', 'RPM(r/min)', 'CardReader Status (-)', 'Oil Level (mm)', 'Fuel Level (mm)', 'DV A (A)', 'DC V (V)', 'DC KW (KW)', 'Wind Speed (Kmph)', 'Wind Direction (Deg)', 'Irradiance (W/m2)', 'Count(-)', 'Setpoint (%)', 'ON/OFF Command ()', 'ON/OFF Status ()', 'Present Demand (KW) (KW)', 'Rising Demand (KW) (KW)', 'On Hours (Hrs)', 'ON/OFF Command ()', 'ON/OFF Status ()'
  ];
  
  finalParameters = this.parameters.map(param => ({
    id: this.parameters.indexOf(param),
    item_text: param.replace(/\s+/g, ' ').trim()
  }));

  dropdownsettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 10,
    allowSearchFilter: true
  }

  updateFormData(field: string, value:any){
    const formData = this.formDataService.getFormData();
    if(Array.isArray(value)){
      formData[field] = value;
    }else{
      formData[field] = value;
    }
    this.formDataService.setFormData(formData);
  }


  changeValue(event: any, value: string) {
    this.radioValue = value;
  }
}

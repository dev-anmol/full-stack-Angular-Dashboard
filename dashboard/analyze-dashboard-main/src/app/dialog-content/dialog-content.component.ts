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
    'A', 'An', 'Ag', 'A1', 'A2', 'A3', 'VLL', 'VLN', 'V12', 'V23', 'V31', 'V1', 'V2', 'V3', 'KW', 'KW1', 'KW2', 'KW3', 'KVA', 'KVAr', 'KVArh', 'KVA1', 'KVA2', 'KVA3', 'KVAR1', 'KVAR2', 'KVAR3', 'PF', 'PF1', 'PF2', 'PF3', 'THDi1', 'THDi2', 'THDi3', 'THDin', 'THDig', 'TDD', 'THDv12', 'THDv23', 'THDv31', 'THDv1', 'THDv2', 'THDv3', 'THDvln', 'VLN_Unbalanced', 'Present_Demand_KW', 'Present_Demand_KVA', 'Present_Demand_KVAr', 'Peak_Demand_KW', 'Peak_Demand_KVA', 'Peak_Demand_KVAr', 'KWh_Received', 'KVARh_Received', 'KVAh_Received'];  
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

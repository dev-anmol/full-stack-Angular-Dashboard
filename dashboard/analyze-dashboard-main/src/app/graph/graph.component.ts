import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import embed, { VisualizationSpec } from 'vega-embed';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';
import { FormService } from '../form.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NgMultiSelectDropDownModule, MatDialogModule, DialogContentComponent,],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  id: number = 1;
  isError: boolean = false;
  selectedGraphType: string = 'bar';
  data: any;
  formDataRes: any;
  startDate: any;
  endDate: any;
  hours = Array.from({ length: 24 }, (_, i) => ({ id: i, item_text: i.toString() }));
  selectedHours: any[] = [];
  view: any;
  AnalysisType: any;
  CompareBy: any;
  PlotBy: any;
  DateRange: any;
  Day: any;
  DataOption: any;
  StartMonth: any;
  EndMonth: any;
  constructor(private dataService: DataService, public dialog: MatDialog, private formDataService: FormService) { }

  @ViewChild('vegachart') img!: ElementRef;

  toggleFullScreen() {
    const elem = this.img.nativeElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { 
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { 
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }

  ngOnInit(): void {
    this.fetchDataAndRenderGraph();
  }
  
  resetFields() {
    this.selectedHours = [];
    this.view = '';
    this.AnalysisType = '';
    this.CompareBy = '';
    this.PlotBy = '';
    this.DateRange = '';
    this.Day = '';
    this.DataOption = '';
    this.StartMonth = '';
    this.EndMonth = '';
  }
  


  openDialog() {
    const dialogRef = this.dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result : ${result}`);
    });
  }


  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 24,
    allowSearchFilter: true
  };

  onSelectHours(item: any) {
    // console.log('Selected:', item);
  }

  onDeselectHours(item: any) {
    // console.log('Deselected:', item);
  }

  onFilterChange(item: any) {
    // console.log('Filter:', item);
  }

  updateFormData(field: string, value: any) {
    const formData = this.formDataService.getFormData();

    if (field === 'startMonth' || field === 'endMonth') {
      const formattedDate = formatDate(value, 'yyyy-MM-dd', 'en-US');
      formData[field] = formattedDate;
    }
    else if (Array.isArray(value)) {
      formData[field] = value;
    }
    else {
      formData[field] = value;
    }
    this.formDataService.setFormData(formData);
  }


  onGraphTypeChange(): void {
    this.fetchDataAndRenderGraph();
  }

  fetchDataAndRenderGraph(): void {
    this.dataService.fetchData(this.id).subscribe(
      (data) => {
        this.data = data;
        this.renderGraph(data);
      },
      (error) => {
        console.error('Error fetching data from backend', error);
        this.isError = true;
      }
    );
    const formData = {...this.formDataService.getFormData()};
    this.dataService.sendRequestWithFormData(formData).subscribe(
      (data) => {
        this.formDataRes = data;
        console.log(this.formDataRes);        
      } 
    )
    this.resetFields();
  }
  fetchFormData(): void {
    const formData = { ...this.formDataService.getFormData() };
    this.dataService.sendRequestWithFormData(formData).subscribe(
      (res) => {
        console.log(formData);
        this.formDataRes = res;
        console.log(this.formDataRes);
      }
    )
  }

  renderGraph(data: any): void {
    const values = [
      { "category": "KW", "amount": data[this.id]?.KW ?? 0 },
      { "category": "KW1", "amount": data[this.id]?.KW1 ?? 0 },
      { "category": "KW2", "amount": data[this.id]?.KW2 ?? 0 },
      { "category": "KW3", "amount": data[this.id]?.KW3 ?? 0 },
      { "category": "KVA", "amount": data[this.id]?.KVA ?? 0 },
      { "category": "KVAr", "amount": data[this.id]?.KVAr ?? 0 },
      { "category": "KVArh", "amount": data[this.id]?.KVArh ?? 0 },
      { "category": "KVA1", "amount": data[this.id]?.KVA1 ?? 0 },
      { "category": "KVA2", "amount": data[this.id]?.KVA2 ?? 0 },
      { "category": "KVA3", "amount": data[this.id]?.KVA3 ?? 0 },
      { "category": "KVAR1", "amount": data[this.id]?.KVAR1 ?? 0 },
      { "category": "KVAR2", "amount": data[this.id]?.KVAR2 ?? 0 },
      { "category": "KVAR3", "amount": data[this.id]?.KVAR3 ?? 0 }
    ];

    const validValues = values.filter(item => item.amount !== null && item.amount !== undefined && !isNaN(item.amount));

    let spec: VisualizationSpec;

    switch (this.selectedGraphType) {
      case 'bar':
        spec = this.getBarChartSpec(validValues);
        break;
      case 'line':
        spec = this.getLineChartSpec(validValues);
        break;
      default:
        spec = this.getBarChartSpec(validValues);
    }
    embed('#vega-chart', spec).catch(console.error);
  }

  getBarChartSpec(values: any[]): VisualizationSpec {
    return {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "width": 900,
      "height": 400,
      "padding": 10,
      "background": "white",
      "data": [
        {
          "name": "table",
          "values": values
        }
      ],
      "signals": [
        {
          "name": "tooltip",
          "value": {},
          "on": [
            { "events": "rect:mouseover", "update": "datum" },
            { "events": "rect:mouseout", "update": "{}" }
          ]
        }
      ],
      "scales": [
        {
          "name": "xscale",
          "type": "band",
          "domain": { "data": "table", "field": "category" },
          "range": "width",
          "padding": 0.05,
          "round": true
        },
        {
          "name": "yscale",
          "domain": { "data": "table", "field": "amount" },
          "nice": true,
          "range": "height"
        }
      ],
      "axes": [
        { "orient": "bottom", "scale": "xscale" },
        { "orient": "left", "scale": "yscale" }
      ],
      "marks": [
        {
          "type": "rect",
          "from": { "data": "table" },
          "encode": {
            "enter": {
              "x": { "scale": "xscale", "field": "category" },
              "width": { "scale": "xscale", "band": 1 },
              "y": { "scale": "yscale", "field": "amount" },
              "y2": { "scale": "yscale", "value": 0 }
            },
            "update": {
              "fill": { "value": "steelblue" }
            },
            "hover": {
              "fill": { "value": "red" }
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "align": { "value": "center" },
              "baseline": { "value": "bottom" },
              "fill": { "value": "#333" }
            },
            "update": {
              "x": { "scale": "xscale", "signal": "tooltip.category", "band": 0.5 },
              "y": { "scale": "yscale", "signal": "tooltip.amount", "offset": -2 },
              "text": { "signal": "tooltip.amount" },
              "fillOpacity": [
                { "test": "isNaN(tooltip.amount)", "value": 0 },
                { "value": 1 }
              ]
            }
          }
        }
      ]
    };
  }

  getLineChartSpec(values: any[]): VisualizationSpec {
    return {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "width": 900,
      "height": 400,
      "padding": 10,
      "background": "white",
      "data": [
        {
          "name": "table",
          "values": values
        }
      ],
      "signals": [
        {
          "name": "tooltip",
          "value": {},
          "on": [
            { "events": "line:mouseover", "update": "datum" },
            { "events": "line:mouseout", "update": "{}" }
          ]
        }
      ],
      "scales": [
        {
          "name": "xscale",
          "type": "point",
          "domain": { "data": "table", "field": "category" },
          "range": "width"
        },
        {
          "name": "yscale",
          "domain": { "data": "table", "field": "amount" },
          "nice": true,
          "range": "height"
        }
      ],
      "axes": [
        { "orient": "bottom", "scale": "xscale" },
        { "orient": "left", "scale": "yscale" }
      ],
      "marks": [
        {
          "type": "line",
          "from": { "data": "table" },
          "encode": {
            "enter": {
              "x": { "scale": "xscale", "field": "category" },
              "y": { "scale": "yscale", "field": "amount" },
              "stroke": { "value": "steelblue" },
              "strokeWidth": { "value": 2 }
            },
            "update": {
              "strokeOpacity": { "value": 1 }
            },
            "hover": {
              "strokeOpacity": { "value": 0.5 }
            }
          }
        }
      ]
    };
  }
}

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
  imports: [CommonModule, FormsModule, SidebarComponent, NgMultiSelectDropDownModule, MatDialogModule, DialogContentComponent],
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
  originalWidth: number = 850;
  originalHeight: number = 400;
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
    document.addEventListener('fullscreenchange', this.onFullScreenChange.bind(this));
  }
  onFullScreenChange() {
    if (document.fullscreenElement) {
      this.resizeVegaChart(true);
    } else {
      this.resizeVegaChart(false);
    }
  }

  resizeVegaChart(fullscreen: boolean) {
    const width = fullscreen ? window.innerWidth : this.originalWidth;
    const height = fullscreen ? window.innerHeight : this.originalHeight;
    this.renderGraph(this.data, width, height);
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
  fetchDataAndRenderGraph(): void {

    this.dataService.fetchData(this.id).subscribe(
      (data) => {
        this.data = data;
        this.renderGraph(data, this.originalWidth, this.originalHeight);
      },
      (error) => {
        console.error('Error fetching data from backend', error);
        this.isError = true;
      }
    );
    const formData = { ...this.formDataService.getFormData() };
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
        this.formDataRes = res;
        console.log(this.formDataRes);
      }
    )
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



  renderGraph(data: any, width: number, height: number): void {
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
      { "category": "KVA2", "amount": data[this.id]?.KVA3 ?? 0 },

    ];

    const validValues = values.filter(item => item.amount !== null && item.amount !== undefined && !isNaN(item.amount));

    let spec: VisualizationSpec;

    switch (this.selectedGraphType) {
      case 'bar':
        spec = this.getBarChartSpec(validValues, width, height);
        break;
      case 'line':
        spec = this.getLineChartSpec(validValues, width, height);
        break;
      case 'pie':
        spec = this.getPieChartSpec(validValues, width, height);
        break;
      default:
        spec = this.getBarChartSpec(validValues, width, height);
    }
    embed('#vega-chart', spec).catch(console.error);
  }
  getBarChartSpec(values: any[], width: number, height: number): VisualizationSpec {
    return {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "width": width,
      "height": height,
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

  getLineChartSpec(values: any[], width: number, height: number): VisualizationSpec {
    return {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "width": width,
      "height": height,
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

  getPieChartSpec(values: any[], width: number, height: number): VisualizationSpec {
    return {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "width": width,
      "height": height,
      "padding": 10,
      "autosize": {
        "type": "fit",
        "contains": "padding"
      },
      "data": [
        {
          "name": "table",
          "values": values,
          "transform": [
            {
              "type": "pie",
              "field": "amount"
            }
          ]
        }
      ],
      "signals": [
        {
          "name": "tooltip",
          "value": {},
          "on": [
            { "events": "arc:mouseover", "update": "datum" },
            { "events": "arc:mouseout", "update": "{}" }
          ]
        }
      ],
      "scales": [
        {
          "name": "color",
          "type": "ordinal",
          "domain": { "data": "table", "field": "category" },
          "range": { "scheme": "category20" }
        }
      ],
      "marks": [
        {
          "type": "arc",
          "from": { "data": "table" },
          "encode": {
            "enter": {
              "fill": { "scale": "color", "field": "category" },
              "x": { "signal": "width / 2" },
              "y": { "signal": "height / 2" },
              "tooltip": { "signal": "{'category': datum.category, 'amount': datum.amount}" }
            },
            "update": {
              "startAngle": { "field": "startAngle" },
              "endAngle": { "field": "endAngle" },
              "padAngle": { "signal": "0.01" },
              "innerRadius": { "signal": "0" },
              "outerRadius": { "signal": "min(width, height) / 2" },
              "cornerRadius": { "signal": "2" },
              "stroke": { "value": "white" },
              "strokeWidth": { "value": 1 }
            }
          }
        },
        {
          "type": "text",
          "from": { "data": "table" },
          "encode": {
            "enter": {
              "x": { "signal": "width / 2" },
              "y": { "signal": "height / 2" },
              "radius": { "signal": "min(width, height) / 2 * 0.8" },
              "theta": { "field": "midAngle" },
              "fill": { "value": "white" },
              "align": { "value": "center" },
              "baseline": { "value": "middle" },
              "text": { "field": "category" }
            }
          }
        }
      ]
    };
  }
}

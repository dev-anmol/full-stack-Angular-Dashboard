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
  StartDate: any;
  EndDate: any;
  hours = Array.from({ length: 24 }, (_, i) => ({ id: i, item_text: i.toString() }));
  selectedHours: any[] = [];
  view: any;
  AnalysisType: any;
  CompareBy: any;
  PlotBy: any;
  DateRange: any;
  DataOption: any;
  originalWidth: number = 850;
  originalHeight: number = 400;
  showAxisName: boolean = false;
  isErrorForm:boolean = false;
  myGlobalData: any;
  iterations: number[] = Array.from({ length: 30 }, (_, i) => i + 1);
  selectedIteration: any = 1;
  dateRangeOption: string = '';
  liveTestCase: boolean = false;
  selectedParams: any;


  constructor(private dataService: DataService, public dialog: MatDialog, private formDataService: FormService) { }

  @ViewChild('vegachart') img!: ElementRef;

  updateAxisName(){
    this.showAxisName = !this.showAxisName;
    this.renderGraphOnly();
  }

  onDateOptionChange():void{
    if(this.DataOption === 'Week'){
      this.setDatesForWeek();
    }
    if(this.DataOption === 'Month'){
      this.setDatesForMonth();
    }
    if(this.DataOption === 'Year'){
      this.setDatesForYear();
    }
    if(this.DataOption === 'Day'){
      this.setDatesForDay();
    }
    if(this.DataOption === 'Live'){
      this.setDatesForLive();
    }
  }

  onLiveTestCase(){
    this.liveTestCase = !this.liveTestCase;
    console.log("live clicked", this.liveTestCase);
  }

  setDatesForLive(){
    const StartDate  = new Date();
    const endOfDay = new Date(StartDate);

    this.EndDate = this.formatDate(endOfDay);
    this.StartDate = this.formatDate(StartDate);

    this.updateFormData('StartDate', this.StartDate);
    this.updateFormData('StartDate', this.EndDate);

  }

  setDatesForYear(): void {
    const today = new Date();
    const endOfYear = new Date(today);

    if (this.dateRangeOption === 'last') {
      endOfYear.setFullYear(today.getFullYear() - 1, 11, 31);
    } else if (this.dateRangeOption === 'previous') {
      endOfYear.setFullYear(today.getFullYear() - 1, 11, 30);
    }

    this.EndDate = this.formatDate(endOfYear);

    const startOfYear = new Date(endOfYear);
    startOfYear.setFullYear(endOfYear.getFullYear() - (this.selectedIteration - 1), 0, 1);

    this.StartDate = this.formatDate(startOfYear);
    this.updateFormData('StartDate', this.StartDate);
    this.updateFormData('EndDate', this.EndDate);
  }
  
  setDatesForWeek():void{
    const today = new Date();
    const endOfWeek = new Date(today);

    if (this.dateRangeOption === 'last') {
      endOfWeek.setDate(today.getDate() - today.getDay() + 6);
    } else if (this.dateRangeOption === 'previous') {
      endOfWeek.setDate(today.getDate() - today.getDay() - 1);
    }

    this.EndDate = this.formatDate(endOfWeek);

    const startOfWeek = new Date(endOfWeek);
    startOfWeek.setDate(endOfWeek.getDate() - (7 * this.selectedIteration) + 1);

    this.StartDate = this.formatDate(startOfWeek);
    this.updateFormData('StartDate', this.StartDate);
    this.updateFormData('EndDate', this.EndDate);
  }
  setDatesForMonth(): void {
    const today = new Date();
    const endOfMonth = new Date(today);

    if (this.dateRangeOption === 'last') {
      endOfMonth.setDate(0);
    } else if (this.dateRangeOption === 'previous') {
      endOfMonth.setMonth(today.getMonth() - 1, 0);
    }

    this.EndDate = this.formatDate(endOfMonth);

    const startOfMonth = new Date(endOfMonth);
    startOfMonth.setMonth(endOfMonth.getMonth() - (this.selectedIteration - 1), 1);

    this.StartDate = this.formatDate(startOfMonth);
    this.updateFormData('StartDate', this.StartDate);
    this.updateFormData('EndDate', this.EndDate);
  }
  setDatesForDay(): void {
    const today = new Date();
    const endOfDay = new Date(today);

    if (this.dateRangeOption === 'last') {
      endOfDay.setDate(today.getDate() - 1);
    } else if (this.dateRangeOption === 'previous') {
      endOfDay.setDate(today.getDate() - 2);
    }

    this.EndDate = this.formatDate(endOfDay);

    const startOfDay = new Date(endOfDay);
    startOfDay.setDate(endOfDay.getDate() - (this.selectedIteration - 1));

    this.StartDate = this.formatDate(startOfDay);
    this.updateFormData('StartDate', this.StartDate);
    this.updateFormData('EndDate', this.EndDate);
  }


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }


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
    const width = fullscreen ? window.innerWidth - 50 : this.originalWidth;
    const height = fullscreen ? window.innerHeight - 50: this.originalHeight;
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
    this.selectedIteration = '';
    this.DataOption = '';
    this.StartDate = '';
    this.EndDate = '';
    this.dateRangeOption = '';
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result : ${result}`);
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
    this.selectedParams = this.formDataService.getFormData();
    console.log("parameters benchmark",this.selectedParams.selectedParameter);

    this.dataService.fetchData(this.id).subscribe(
      (data) => {  
        this.data = data;
        this.myGlobalData = data;
        console.log("this is the data",data);
        this.renderGraph(data, this.originalWidth, this.originalHeight);
      },
      (error) => {
        console.error('Error fetching data from backend', error);
        this.isErrorForm = true;
        alert('No data found in the database')
      }
    );
    this.resetFields();
  }

  renderGraphOnly():void{
    this.renderGraph(this.myGlobalData, this.originalWidth, this.originalHeight);
  }
  fetchFormData(): any {
    const formData = { ...this.formDataService.getFormData() };
    this.dataService.sendRequestWithFormData(formData, this.id).subscribe({
      next:(res) => {
        if(res.recordset.length === 0){
          console.log("response is empty")
        }else{
          this.formDataRes = res;
          console.log("data fetched after selecting the parameters",this.formDataRes.recordset);
          this.renderGraph(this.formDataRes.recordset, this.originalWidth, this.originalHeight);
        }

      }, error: (error) => {
        this.isErrorForm = true;
        console.error('No Data found in the database', error);
      }

    }
    )
    this.resetFields();
  }

  updateFormData(field: string, value: any) {
    const formData = this.formDataService.getFormData();

    if (field === 'StartDate' || field === 'EndDate') {
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
    console.log(this.selectedParams.selectedParameter);

      // {"category": this.selectedParams.selectedParameter[0].item_text, "amount": data[this.id]?.KW ?? 0 },
      // { "category": this.selectedParams.selectedParameter[1].item_text, "amount": data[this.id]?.KW1 ?? 0 },
      // { "category": this.selectedParams.selectedParameter[2].item_text, "amount": data[this.id]?.KW2 ?? 0 },
      // { "category": this.selectedParams.selectedParameter[3].item_text, "amount": data[this.id]?.KW3 ?? 0 },
      // { "category": this.selectedParams.selectedParameter[4].item_text, "amount": data[this.id]?.KVA ?? 0 },
      // { "category": this.selectedParams.selectedParameter[5].item_text, "amount": data[this.id]?.KVAr ?? 0 },
      // { "category": this.selectedParams.selectedParameter[6].item_text, "amount": data[this.id]?.KVArh ?? 0 },
      // { "category": this.selectedParams.selectedParameter[7].item_text, "amount": data[this.id]?.KVA1 ?? 0 },
      // { "category": this.selectedParams.selectedParameter[8].item_text, "amount": data[this.id]?.KVA2 ?? 0 },
    
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
        { "orient": "bottom", "scale": "xscale", "title": this.showAxisName ? "parameters":undefined },
        { "orient": "left", "scale": "yscale", "title": this.showAxisName ? "value" : undefined  }
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
        { "orient": "bottom", "scale": "xscale", "title": this.showAxisName ? "parameters":undefined },
        { "orient": "left", "scale": "yscale", "title": this.showAxisName ? "value" : undefined  }
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

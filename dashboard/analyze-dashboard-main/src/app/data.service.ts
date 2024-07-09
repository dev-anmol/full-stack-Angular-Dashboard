// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cache = new Map<number, Observable<any>>();

  constructor(private http: HttpClient) { }

  fetchData(id: number): Observable<any> {
    if (!this.cache.has(id)) {
      const data$ = this.http.get<any>(`http://localhost:3000/data-energy/${id}`).pipe(
        map(data => this.transformData(data)),
        catchError(error => {
          console.error('Error fetching data from backend', error);
          return of(null);
        }),
        shareReplay(1)
      );
      this.cache.set(id, data$);
    }
    return this.http.get<any>(`http://localhost:3000/data-energy/${id}`);
  }
  sendRequestWithFormData(formData: any, id:number): Observable<any> {
    console.log("data.service.ts",formData);
    const params = new HttpParams()
      .set('view', formData.view)
      .set('analysisType', formData.analysisType)
      .set('compareBy', formData.compareBy)
      .set('plotBy', formData.plotBy)
      .set('selectedHours', formData.selectedHours)
      .set('dateRangeOption', formData.dateRangeOption)
      .set('selectedIteration', formData.selectedIteration)
      .set('dataOption', formData.dataOption)
      .set('StartDate', formData.StartDate)
      .set('EndDate', formData.EndDate)
      .set('pFacility', formData.PFacility)
      .set('pDevice', formData.PDevice)
      .set('selectedParameters', formData.selectedParameter)
      .set('pGraphType', formData.PgraphType)
      .set('pPlotAxis', formData.PplotAxis)
      .set('bFacility', formData.BFacility)
      .set('bDevice', formData.BDevice)
      .set('bBenchmark', formData.BBenchMark)
      .set('bPlotAxis', formData.BBenchmarkPA)
      .set('sFacility', formData.SFacility)
      .set('sDevice', formData.SDevice)
      .set('sParameter', formData.SParameter)
      .set('sGraphType', formData.SgraphType)
      .set('sPlotAxis', formData.SPlotAxis)
      .set('kFacility', formData.KFacility)
      .set('kpi', formData.Kpi)
    console.log("Params",params);
    return this.http.get<any>(`http://localhost:3000/form-data/${id}`, { params });
  }

  private transformData(data: any): any {
    return data;
  }
}

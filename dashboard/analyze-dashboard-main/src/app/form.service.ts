import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface FormData {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private formDataSource = new BehaviorSubject<FormData>({});
  formData = this.formDataSource.asObservable();

  constructor() { }

  setFormData(data: FormData) {
    const currentData = this.formDataSource.getValue();
    const updatedData = { ...currentData, ...data };
    this.formDataSource.next(updatedData);
  }

  getFormData(): FormData {
    console.log("form.service.ts",this.formData);
    // this.formData.forEach((item)=>{
    //   console.log(item);
    // })
    return this.formDataSource.getValue();
  }
}

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
    console.log(this.formData);
    this.formData.forEach((item)=>{
    })
    return this.formDataSource.getValue();
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from '../app.constant';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http : HttpClient, private constant : Configuration) { }

  getData(){
   return this.http.get(this.constant.fetchEmployeeData);
  }
}

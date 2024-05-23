import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { Datacomm } from '../models/datacomm.model';
import { User } from '../models/user.model';
const API_URL_cloud= 'https://macompta.com.tn:3002/api/datacomm/'
const API_URL_test = 'http://localhost:3005/api/datacomm/'; 
@Injectable({
    providedIn: 'root'
  })
  export class datacommService {
    headers = new HttpHeaders().set('Content-Type', 'application/json',);
    currentUser = {};
    window: any;
    private datas: Datacomm[] = [];
  public datacomm$ = new Subject<Datacomm[]>();
    constructor(
      private http: HttpClient,
      public router: Router
    ) { }
  
    createdata(datacomm: any[]) {
      
      return new Promise((resolve, reject) => {
        
        this.http.post(API_URL_cloud, datacomm).subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      });
    }

getmanyinfo(compte: any) 
{
  return new Promise((resolve, reject) => {
    this.http.post(API_URL_cloud+ 'filtermanycommid', { compte }).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
    );
  })
}
  }
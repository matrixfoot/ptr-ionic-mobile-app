import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { Data } from '../models/data.model';
import { User } from '../models/user.model';
const API_URL_cloud= 'https://macompta.com.tn:3002/api/data/'
const API_URL_test = 'http://localhost:3005/api/data/'; 
@Injectable({
    providedIn: 'root'
  })
  export class dataService {
    headers = new HttpHeaders().set('Content-Type', 'application/json',);
    currentUser = {};
    window: any;
    private datas: Data[] = [];
  public data$ = new Subject<Data[]>();
    constructor(
      private http: HttpClient,
      public router: Router
    ) { }
  
    createdata(data: any[]) {
      
      return new Promise((resolve, reject) => {
        
        this.http.post(API_URL_cloud, data).subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      });
    }
    getinfo(data:any) 
{
  return new Promise((resolve, reject) => {
    this.http.post(API_URL_cloud+ 'filteruserchoice', { data }).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
    );
  })
}
getmanyinfo(compte: any) 
{
  return new Promise((resolve, reject) => {
    this.http.post(API_URL_cloud+ 'filtermanyuserchoice', { compte }).subscribe(
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
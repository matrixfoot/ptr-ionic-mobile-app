import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { Comp } from '../models/comp-files';
const API_URL_cloud= 'https://macompta.com.tn:3002/api/comps/'
const API_URL_test = 'http://localhost:3005/api/comps/'; 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
@Injectable({ providedIn: 'root' })
export class CompService {
    
    
    constructor(private http: HttpClient) { }
    public comps: Comp[] = [];
    public comps$ = new Subject<Comp[]>();
 

    getComps() {
        this.http.get(API_URL_cloud).subscribe(
          (comps: Comp[]) => {
            if (comps) {
              this.comps = comps;
              this.emitComps();
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    
      emitComps() {
        this.comps$.next(this.comps);
      }
      getCompdataById(id: string) {
        return new Promise((resolve, reject) => {
            this.http.get(API_URL_cloud + id).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error); 
            }
          );
        });
      }
      getComp(userId: string) {
        return new Promise((resolve, reject) => {
          this.http.post(API_URL_cloud +'comp' ,{userId}).subscribe(
            (comps: Comp[]) => {
              if (comps) {
                this.comps = comps;
                this.emitComps();
              }
            },
            (error) => {
              console.log(error);
            }
          );
        });
      }
      create(Comp: Comp, image: File| string) {
        return new Promise((resolve, reject) => {
          let Compdata: Comp | FormData;
          if (typeof image === 'string') {
            Compdata = Comp;
          } else {
            Compdata = new FormData();
            Compdata.append('comp', JSON.stringify(Comp));
            Compdata.append('image', image, Comp.date);
          }
          this.http.post(API_URL_cloud, Compdata).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        }); 
      }
      getusercomp(carte: string) 
      {
        return new Promise((resolve, reject) => {
          this.http.get(API_URL_cloud+'filteruserchoice/'+carte).subscribe(
              (response) => {
                resolve(response);
              },
              (error) => {
                reject(error);
              }
          );
        })
      }
      modify(id: string, Comp: Comp, file: File | string) {
        return new Promise((resolve, reject) => {
          let Compdata: Comp | FormData;
          if (typeof file === 'string') {
            //@ts-ignore
            Comp.changements[Comp.changements.length-1].ficheUrl = file;
            Compdata = Comp;
          } else {
            Compdata = new FormData();
            Compdata.append('comp', JSON.stringify(Comp));
            Compdata.append('image', file, Comp._id);
          }
          this.http.put(API_URL_cloud + id, Compdata).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }
      savecompById(id: string, comp: Comp) {
        return new Promise((resolve, reject) => {
          
            
          
          this.http.put(API_URL_cloud+'modify/'+ id, comp).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }
      deleteCompdataById(id: string) {
        return new Promise((resolve, reject) => {
          this.http.delete(API_URL_cloud+ id).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }  
    }

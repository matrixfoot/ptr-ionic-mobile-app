import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Habilitation } from '../models/habilitation.model';
const API_URL_test = 'http://localhost:3005/api/habilitation/';
const API_URL_cloud= 'https://macompta.com.tn:3002/api/habilitation/'
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
@Injectable({ providedIn: 'root' })
export class HabilitationService {
    
    
    constructor(private http: HttpClient) { }
    public habilitations: Habilitation[] = [
    
    ];
    public habilitations$ = new Subject<Habilitation[]>();
 
    createwithoutfile(habilitation: Habilitation) {
      return new Promise((resolve, reject) => {
        
        this.http.post(API_URL_cloud, habilitation).subscribe(
          (response) => {
            resolve(response);

          },
          (error) => {
            reject(error);
          },
        );
      });
    }
    gethabilitationss() {
        this.http.get(API_URL_cloud).subscribe(
          (habilitations: Habilitation[]) => {
            if (habilitations) {
              this.habilitations = habilitations;
              this.emithabilitationss();

            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    
      emithabilitationss() {
        this.habilitations$.next(this.habilitations);
      }
      getHabilitationreqById(id: string) {
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
      gethabilitation(userId: string) {
        return new Promise((resolve, reject) => {
          this.http.post(API_URL_cloud  ,{userId}).subscribe(
            (habilitations: Habilitation[]) => {
              if (habilitations) {
                this.habilitations = habilitations;
                this.emithabilitationss();
              }
            },
            (error) => {
              console.log(error);
            }
          );
        });
      }
      
   /* geexistentthabilitation(userId: string,annee:string,mois:string,source:string) 
    {
return new Promise((resolve, reject) => {
        this.http.post(API_URL_cloud+'/anneemois/',{userId,annee,mois,source}).subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error); 
          }
        );
      });

      }*/
      
    /*  create(habilitation: Habilitation) {
        return new Promise((resolve, reject) => {
          
          this.http.post(API_URL_cloud, habilitation).subscribe(
            (response) => {
              resolve(response);

            },
            (error) => {
              reject(error);
            },
          );
        });
      }*/
    
     
    
     /* modify(id: string, habilitationreq: Habilitation, image: File | string) {
        return new Promise((resolve, reject) => {
          let habilitationreqData: Habilitation | FormData;
          if (typeof image === 'string') {
            
            habilitationreqData = habilitationreq;
          } else {
            habilitationreqData = new FormData();
            habilitationreqData.append('habilitationreq', JSON.stringify(habilitationreq));
            habilitationreqData.append('image', image, habilitationreq.email);
          }
          this.http.put(API_URL_cloud + id, habilitationreqData).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }*/
      modifyhabilitationreqById(id: string, habilitation: Habilitation) {
        return new Promise((resolve, reject) => {
          
            
          
          this.http.put(API_URL_cloud+ id, habilitation).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        }); 
      }
     /* completehabilitationreqById(id: string, habilitation: Habilitation) {
        return new Promise((resolve, reject) => {
          
            
          
          this.http.put(API_URL_cloud+'modify/'+ id, habilitation).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }*/
    
      deletehabilitationById(id: string) {
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
      deletehabilitationss() {
        return new Promise((resolve, reject) => {
          this.http.delete(API_URL_cloud).subscribe(
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

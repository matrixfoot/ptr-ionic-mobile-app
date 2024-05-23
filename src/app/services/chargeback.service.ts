import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Chargeback } from '../models/chargeback.model';
const API_URL_test = 'http://localhost:3005/api/chargeback/';
const API_URL_cloud= 'https://macompta.com.tn:3002/api/chargeback/'
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
@Injectable({ providedIn: 'root' })
export class ChargebackService {
    
    
    constructor(private http: HttpClient) { }
    public chargebacks: Chargeback[] = [];
    public chargebacks$ = new Subject<Chargeback[]>();
 
    create(chargeback: Chargeback) {
      return new Promise((resolve, reject) => {
        
        this.http.post(API_URL_cloud, chargeback).subscribe(
          (response) => {
            resolve(response);

          },
          (error) => {
            reject(error);
          },
        );
      });
    }
    getchargebacks() {
            return new Promise((resolve, reject) => {
                this.http.get(API_URL_cloud).subscribe(
                  (response) => {
                    resolve(response);
                  },
                  (error) => {
                    reject(error); 
                  }
                );
              });
      }
    
    /*  emitchargebacks() {
        this.chargebacks$.next(this.chargebacks);
      }*/
      getchargebackById(id: string) {
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
   /* geexistenttmotifreclamation(userId: string,annee:string,mois:string,source:string) 
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
      
    /*  create(motifreclamation: Motif) {
        return new Promise((resolve, reject) => {
          
          this.http.post(API_URL_cloud, motifreclamation).subscribe(
            (response) => {
              resolve(response);

            },
            (error) => {
              reject(error);
            },
          );
        });
      }*/
    
     
    
     /* modify(id: string, motifreclamationreq: Motif, image: File | string) {
        return new Promise((resolve, reject) => {
          let motifreclamationreqData: Motif | FormData;
          if (typeof image === 'string') {
            
            motifreclamationreqData = motifreclamationreq;
          } else {
            motifreclamationreqData = new FormData();
            motifreclamationreqData.append('motifreclamationreq', JSON.stringify(motifreclamationreq));
            motifreclamationreqData.append('image', image, motifreclamationreq.email);
          }
          this.http.put(API_URL_cloud + id, motifreclamationreqData).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }*/
     /* completemotifreclamationreqById(id: string, motifreclamation: Motif) {
        return new Promise((resolve, reject) => {
          
            
          
          this.http.put(API_URL_cloud+'modify/'+ id, motifreclamation).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }*/
    
      deletechargebackById(id: string) {
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
      deletechargebacks() {
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

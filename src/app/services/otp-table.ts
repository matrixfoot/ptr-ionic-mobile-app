import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { OTP } from '../models/otp-table';
const API_URL_test = 'http://localhost:3005/api/otp/';
const API_URL_cloud= 'https://macompta.com.tn:3002/api/otp/'
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
@Injectable({ providedIn: 'root' })
export class OTPService {
    
    
    constructor(private http: HttpClient) { }
    public otps: OTP[] = [];
    public otps$ = new Subject<OTP[]>();
 
    createwithoutfile(userId:string) {
      return new Promise((resolve, reject) => {
        
        this.http.post(API_URL_cloud, userId).subscribe(
          (response) => {
            resolve(response);

          },
          (error) => {
            reject(error);
          },
        );
      });
    }
    validateotp(otptoken: string) 
{
  return new Promise((resolve, reject) => {
    this.http.post(API_URL_cloud+ 'validate', { otptoken }).subscribe(
      (response) => {
        resolve(response);
      },
      (error) => {
        reject(error);
      }
    );
  });
}
    getotpss() {
        this.http.get(API_URL_cloud).subscribe(
          (otps: OTP[]) => {
            if (otps) {
              this.otps = otps;
              this.emitotpss();

            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    
      emitotpss() {
        this.otps$.next(this.otps);
      }
      getOTPreqById(id: string) {
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
      getotp(userId: string) {
        return new Promise((resolve, reject) => {
          this.http.post(API_URL_cloud  ,{userId}).subscribe(
            (otps: OTP[]) => {
              if (otps) {
                this.otps = otps;
                this.emitotpss();
              }
            },
            (error) => {
              console.log(error);
            }
          );
        });
      }
      
   /* geexistenttotp(userId: string,annee:string,mois:string,source:string) 
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
      
    /*  create(otp: OTP) {
        return new Promise((resolve, reject) => {
          
          this.http.post(API_URL_cloud, otp).subscribe(
            (response) => {
              resolve(response);

            },
            (error) => {
              reject(error);
            },
          );
        });
      }*/
    
     
    
     /* modify(id: string, otpreq: OTP, image: File | string) {
        return new Promise((resolve, reject) => {
          let otpreqData: OTP | FormData;
          if (typeof image === 'string') {
            
            otpreqData = otpreq;
          } else {
            otpreqData = new FormData();
            otpreqData.append('otpreq', JSON.stringify(otpreq));
            otpreqData.append('image', image, otpreq.email);
          }
          this.http.put(API_URL_cloud + id, otpreqData).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }*/
      modifyotpreqById(id: string, otp: OTP) {
        return new Promise((resolve, reject) => {
          
            
          
          this.http.put(API_URL_cloud+ id, otp).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        }); 
      }
     /* completeotpreqById(id: string, otp: OTP) {
        return new Promise((resolve, reject) => {
          
            
          
          this.http.put(API_URL_cloud+'modify/'+ id, otp).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }*/
    
      deleteotpById(id: string) {
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
      deleteotpss() {
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

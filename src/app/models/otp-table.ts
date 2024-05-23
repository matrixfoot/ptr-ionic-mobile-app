
export class OTP {
    userId: string;
    _id:string;
    otp: { 
        value: String,
        expires: Date
    };
    created:Date;
    updated: Date;
  }

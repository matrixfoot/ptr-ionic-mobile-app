export class Chargeback {
   
    _id: string;
            MERCHANTIDENTIFICATION:string;
            BATCHIDENTIFICATION:string;
            INVOICENUMBER:string;
            CARDHOLDERNUMBER:string;
            MERCHANTSECTOR:string;
            CHANNELTRANSACTIONID:string;
            OPERATIONCODE:string;
            TRANSACTIONCODE:string;
            TRANSACTIONAMOUNT:string;
            CARDEXPIRYDATE:string;
            PROCESSINGDATE:Date;
            TRANSACTIONDATE:Date;
            AUTHORIZATIONCODE:string;
            REMITTANCEDATE:string;
            MERCHANTCATEGORIECODE:string;
            FILLER:string;
            ACQUIRERBANKIDENTIFICATION:string;
            LOCALCARDSYSTEMNETWORK:string;
            ISSUERBANKIDENTIFICATION:string;
            ACQUIRERREFERENCENUMBER:string;
            TRANSACTIONORDERUSAGECODE:string;
           
            CHARGEBACKREASONCODE:
                string
            ;
            FILLERCHARGEBACK:
                string
            ;
            SETTLEMENTAMOUNT:
                string
            ;
            
            TRANSACTIONTIME:
                string
            ;
        
            ENDOFRECORDCHARGEBACK:
                string
            ;
            
            CHARGEBACKTRANSACTIONCYCLE:
                string
            ;
            MESSAGE:
                string
            ; 
    created:Date; 
    updated: Date
}

 export class ResponseModelPaseDetail
{
         dateTxn!: string;
         codeCollector!: string;
         codeCompany!: string;
         codeService!: string;
         codeDepositor!: string;
         codeDepositorDesc!: string;
         nameDepositor!: string;
         totalAmount!: number;
         amountIPay!: number;
         amountDwells!: number;
         currency!: string;
         currencyDescription!: string;
         hourTxn!: string;
         office!: string;
         datesMaturity!: string;
         numberTxn!: string;
         numberDocument!: string;
         nroCounts!: string;
         quantity!: number;
         constructor(values: Object = {}) {
            Object.assign(this, values);
          }
        
}



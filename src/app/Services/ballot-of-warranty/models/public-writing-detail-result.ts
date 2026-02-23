export class PublicWritingDetailResult {
     publicWritingNumber!: string;
     datePublicWriting!: Date;
     nameOfNotaryPublicFaith!: string;

     constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

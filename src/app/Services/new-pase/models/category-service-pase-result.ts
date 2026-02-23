export class CategoryServicePaseResult {
    code!: string;
    description!: string;
    name!: string;
    isActive!: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
    }
    export class CategoryServiceDto {
        categoryCode!: string;
        constructor(values: Object = {}) {
            Object.assign(this, values);
        }
        }
        
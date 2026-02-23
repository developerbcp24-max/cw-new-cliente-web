export class GetCriteriaResponse {
    numberOfCriteria!: number;
    criteria: Criteria [] = [];
}

export class Criteria {
    name!: string;
    codeCriteria!: string;
    numberOfItemsCriteria!: number;
    itemCriteria: ItemCriteria [] = [];
}

export class ItemCriteria {
    name!: string;
    type!: string;
}

import { DebtDetail } from "./debt-detail";

export class PropertyDebtResult {
  property!: Property;
  debtDetail!: DebtDetail[];
}

class Property {
  number!: string;
  type!: string;
  address!: string;
  cityHallCode!: string;
  cadastralCode!: string;
  class!: string;
  tributaryZone!: string;
  area!: string;
  groundSurface!: string;
  constructionSurface!: string;
  constructionNumber!: number;
}

import { DebtDetail } from "./debt-detail";

export class VehicleDebtResult {
  vehicle!: Vehicle;
  debtDetail!: DebtDetail[];
}

class Vehicle {
  class!: string;
  brand!: string;
  model!: string;
  color!: string;
  pta!: string;
  amount!: number;
}

export class EmployResult {
      id!: string;
      name!: string;
      firstLastName!: string;
      secondLastName!: string;
      isChecked?: boolean;

      constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class ItemMenu {
  label!: number | string;
  routerLink: string='';
  module?: string;
  code?: any;
  items: ItemMenu[] = [];
  subItems: ItemMenu[] = [];
  open: boolean = false;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

import {ApproverOrController} from './ApproverOrControllerModel';
export class ListCtrlAuth {

  approversNumber!: number;
  controllersNumber!: number;
  approvers!: ApproverOrController[];
  controllers!: ApproverOrController[];
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

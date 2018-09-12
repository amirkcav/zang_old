export class Field {
  pm: any;
  line: any;
  field: any;
  constructor(pm: any, line: any, field: any) {
    this.pm = pm;
    this.line = line;
    this.field = field;
  }
}

export interface ISetValue {
  setValue(field: Field, value: any): void;
}

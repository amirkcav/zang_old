import { ISetValue } from '../interfaces';

export class Page {
  id: string;
  title: string;
  disabled: boolean;        
  pmRows: PMRow[];
  components: { [id: number]: ISetValue } = {};

  constructor(id?, title?, disabled?, pmRows?) {
    this.id = id;
    this.title = title;
    this.disabled = disabled;
    this.pmRows = new Array<PMRow>();
    pmRows.forEach(row => {
      this.pmRows.push(new PMRow(row.id, row.pms));
    });
  }
}

export class PMRow {
  id: string;
  pms: PM[];

  constructor(id, pms) {
    this.id = id;
    this.pms = new Array<PM>();
    pms.forEach(pm => {
      this.pms.push(new PM(pm.id, pm.title, pm.type, pm.width, pm.fieldRows));
    });
  }
}

export class PM {
  id: string;
  title: string;
  type: string;
  width: number;
  fieldRows: any[];
  
  constructor(id, title, type, width, fieldRows) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.width = width;
    this.fieldRows = fieldRows;
  }

  widthClass() {
    let widthClass = 'ui-lg-';
    if (!this.width) {
      widthClass += 12;
    }
    if (this.width % 33 === 0) {
      widthClass += 4 * (this.width / 33);
    }
    else {
      widthClass += 12 * this.width / 100;
    }
    return widthClass;
  }
}

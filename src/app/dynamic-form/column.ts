export class Column {
  id: string;
  name: string;
  type: string;
  editable: boolean;
  sortable: boolean;
  draggable: boolean;
  headerClass: string;
  cellClass: string;
  minWidth: number;
  visible: boolean;

  constructor(options: {
    id?: string,
    name?: string,
    type?: string,
    editable?: boolean,
    sortable?: boolean,
    draggable?: boolean,
    headerClass?: string,
    cellClass?: string,
    minWidth?: number,
    visible?: boolean
      }) {
    this.id = options.id;
    this.name = options.name;
    this.type = options.type || null;
    this.editable = !!options.editable;
    this.sortable = !!options.sortable;
    this.draggable = !!options.draggable;
    this.headerClass = options.headerClass || null;
    this.cellClass = options.cellClass || null;
    this.minWidth = options.minWidth || null;
    this.visible = options.visible === undefined ? true : options.visible;
  }
}

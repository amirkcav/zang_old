export class Column {
  id: string;
  field: string;
  name: string;
  type: string;
  editable: boolean;
  sortable: boolean;
  draggable: boolean;
  headerClass: string;
  cellClass: string;
  minWidth: number;
  maxWidth: number;
  width: number;
  visible: boolean;
  buttons: string[];
  isEditable: boolean;
  options: any[];
  landscapeOnly?: boolean;

  constructor(options: {
    id?: string,
    field?: string,
    name?: string,
    type?: string,
    editable?: boolean,
    sortable?: boolean,
    draggable?: boolean,
    headerClass?: string,
    cellClass?: string,
    minWidth?: number,
    maxWidth?: number,
    width?: number,
    visible?: boolean,
    buttons?: string[],
    isEditable?: boolean,
    options: any[],
    landscapeOnly?: boolean
  }) {
    this.id = options.id;
    this.field = options.field;
    this.name = options.name;
    this.type = options.type || null;
    this.editable = !!options.editable;
    this.sortable = !!options.sortable;
    this.draggable = !!options.draggable;
    this.headerClass = options.headerClass || null;
    this.cellClass = options.cellClass || null;
    this.minWidth = options.minWidth || 80;
    this.maxWidth = options.maxWidth || null;
    this.width = options.width || 80;
    this.visible = options.visible === undefined ? true : options.visible;
    this.buttons = options.buttons || [];    
    this.isEditable = options.isEditable;
    this.options = options.options || [];    
    this.landscapeOnly = options.landscapeOnly || false;    
  }
}

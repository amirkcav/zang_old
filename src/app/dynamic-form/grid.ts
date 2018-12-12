import { Column } from './column';

export class Grid {
  class: string;
  headerHeight: number;
  limit: number;
  columnMode: string;
  footerHeight: number;
  rowHeight: Function | number | undefined;
  reorderable: boolean;
  scrollbarH: boolean;
  scrollbarV: boolean;
  columns: Column[];
  title: string;
  landscapeOnly: boolean;

  constructor(options: {
    class?: string;
    headerHeight?: number;
    limit?: number;
    columnMode?: string;
    footerHeight?: number;
    rowHeight?: Function | number | undefined;
    reorderable?: boolean;
    scrollbarH?: boolean;
    scrollbarV?: boolean;
    columns?: any[];
  }) {
    this.class = options.class || 'material';
    this.headerHeight = options.headerHeight || 50;
    this.limit = options.limit || undefined;
    this.columnMode = options.columnMode || 'standard';
    this.footerHeight = options.footerHeight || 0;
    this.rowHeight = options.rowHeight || undefined;
    this.reorderable = !!options.reorderable;
    this.scrollbarH = !!options.scrollbarH;
    this.scrollbarV = !!options.scrollbarV;
    this.title = options['gridTitle'];

    // Create the columns array
    if (options.columns) {
      this.columns = options.columns.map(column => new Column(column));
    } 
    else {
      this.columns = [] as Column[];
    }

  }
}

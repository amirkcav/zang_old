import { Column } from './column';

export class Grid {
  class: string;
  headerHeight: number;
  limit: number;
  columnMode: string;
  footerHeight: number;
  rowHeight: Function | number | undefined;
  reorderable: boolean;
  columns: Column[];

  constructor(options: {
    class?: string;
    headerHeight?: number;
    limit?: number;
    columnMode?: string;
    footerHeight?: number;
    rowHeight?: Function | number | undefined;
    reorderable?: boolean;
    columns?: any[];
  }) {
    this.class = options.class || 'bootstrap';
    this.headerHeight = options.headerHeight || 30;
    this.limit = options.limit;
    this.columnMode = options.columnMode || 'standard';
    this.footerHeight = options.footerHeight || 0;
    this.rowHeight = options.rowHeight || undefined;
    this.reorderable = !!options.reorderable;

    // Create the columns array
    if (options.columns) {
      this.columns = options.columns.map(column => new Column(column));
    } else {
      this.columns = [] as Column[];
    }
  }
}

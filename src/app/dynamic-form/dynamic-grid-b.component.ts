import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    ViewChild
  } from '@angular/core';
  // import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { Subject } from 'rxjs/Subject';
  
  import { Grid } from './grid';
  import { Column } from './column';
  
  import { QuestionService } from './question.service';
  import { ConfirmDialogModule } from 'primeng/confirmdialog';
  import { ConfirmationService, SortEvent } from 'primeng/api';
  import { Table } from 'primeng/table';
  import { Dialog } from 'primeng/dialog';
  
  @Component({
    selector: 'dynamic-grid-b',
    templateUrl: './dynamic-grid-b.component.html',
    styleUrls: ['./dynamic-grid-b.component.css'],
    providers: [ QuestionService, ConfirmationService ]
  })
  export class DynamicGridBComponent implements OnInit, OnChanges {    
    @ViewChild('dt') dt: Table
    @ViewChild('dialog') dialog: Dialog
    
    @Input() gridKey: string;
    @Input() gridParameters: any = null;
  
    @Output() onClicked = new EventEmitter<any>();
  
    grid: Grid = new Grid({});
    data: any[];
  
    loadingGrid: Promise<Grid>;
    loadingGridData: Promise<any[]>;

    rowsInPage: number;

    editDataHolder: any[];
    editDataIndex: number = -1;
  
    currObject: any = {};
    objFields: string[] = [];
    displayDialog = false;

    constructor(private service: QuestionService, private confirmationService: ConfirmationService) {}
  
    ngOnChanges() {
      this.initGrid();
    }
  
    ngOnInit() {
      // this.initGrid();
    }
  
    initGrid(): void {
      // load the grid definitions
      this.loadingGrid = this.service.getGrid(this.gridKey, this.gridParameters);
      this.loadingGrid.then(response => {
        this.grid = response;
        this.setEmptyObject();
        this.objFields = Object.keys(this.currObject.fields);
      });
  
      // load the grid data
      this.loadingGridData = this.service.getGridData(this.gridKey, this.gridParameters);
      this.loadingGridData.then(response => {
        this.data = response;
      });
    }
  
    cellClicked(event, cell, cellValue, row) {
      this.onClicked.emit({
        line: this.data[row.$$index],
        row: row.$$index,
        column: cell
      });
    }
  
    onClick(event) {
      this.onClicked.emit(event);
    }

    edit(rowData) {
      this.dialog.header = 'Edit row';
      const rowIndex = this.data.indexOf(rowData);
      this.currObject.rowIndex = rowIndex;
      this.currObject.fields = Object.assign({}, rowData);
      this.displayDialog = true;
    }

    delete(data) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
          const deletedRow = this.data.indexOf(data);
          // - this.dt.first is for after the first page, because this.data contains all rows, and tableElement.rows contains only the visible rows.
          this.dt.domHandler.fadeOut(this.dt.tableViewChild.nativeElement.rows[deletedRow + 1 - this.dt.first], 300);
          setTimeout(() => {
            this.data.splice(deletedRow, 1);            
            this.refreshTable();
          }, 300);
        }
      });
    }

    saveDynamic(data) {
      // edit row
      if (this.currObject.rowIndex !== undefined) {
        this.data[this.currObject.rowIndex] = data; 
      }
      // new row
      else {
        this.data.push(data);
      }
      this.refreshTable();
      this.setEmptyObject();
      this.displayDialog = false;
    }

    save() {
      const obj = Object.assign({}, this.currObject);
      // edit row
      if (this.currObject.rowIndex !== undefined) {
        this.data[this.currObject.rowIndex] = obj.fields;
      }
      // new row
      else {
        this.data.push(obj.fields);
      }
      this.refreshTable();
      this.setEmptyObject();
      this.displayDialog = false;
    }

    setEmptyObject() {
      this.currObject.fields = {};
      this.grid.columns.filter((c) => c.type !== 'buttons').forEach((c) => {
        this.currObject.fields[c.field] = ' ';
      });
      this.currObject.rowIndex = undefined;
    }
    
    addRow() {
      this.dialog.header = 'New row';
      this.displayDialog = true;
    }

    refreshTable() {
      // needed to update the number of pages etc.
      this.dt.totalRecords = this.data.length;
      this.dt.sortSingle();
    }

    customSort(event: SortEvent) {
      const column = this.grid.columns.find(function(c) { return c.id === event.field });

      if (column['type'] === 'date') {
        event.data.sort((data1, data2) => {
          // changing dd/mm/yyyy to yyyymmdd (which is the format to sort dates).
          const value1 = +data1[event.field].split('/').reverse().join('');
          const value2 = +data2[event.field].split('/').reverse().join('');
          const result = value1 > value2 ? 1 : -1;
          return (event.order * result);
        });
      }
      else if (column['type'] === 'checkbox') {
        event.data.sort((data1, data2) => {
          const result = data1[event.field].toString() === 'true' ? 1 : -1;
          return (event.order * result);
        });
      }
      else {
        event.data.sort((data1, data2) => {
          // make no difference between number and number as strings
          const value1 = +data1[event.field];
          const value2 = +data2[event.field];
          const result = value1 > value2 ? 1 : -1;
          return (event.order * result);
        });
      }
    }

    cancel() {
      this.displayDialog = false;
      this.setEmptyObject();      
    }

  }

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
  import { IDynamicComponent, Field } from '../interfaces';
  import { PM } from '../dynamic-page/dynamic-page.model';
import { DynamicFormComponent } from './dynamic-form.component';
  
  @Component({
    selector: 'dynamic-grid-b',
    templateUrl: './dynamic-grid-b.component.html',
    styleUrls: ['./dynamic-grid-b.component.css'],
    providers: [ QuestionService, ConfirmationService ]
  })
  export class DynamicGridBComponent implements OnInit, OnChanges, IDynamicComponent {    
    @ViewChild('dt') dt: Table
    @ViewChild('dialog') dialog: Dialog
    @ViewChild('form') form: DynamicFormComponent
    
    @Input() gridKey: string;
    @Input() gridParameters: any = null;

    @Input() data: PM;

    @Output() onClicked = new EventEmitter<any>();
  
    grid: Grid = new Grid({});
    // data: any[];
  
    loadingGrid: Promise<Grid>;
    loadingGridData: Promise<any[]>;

    rowsInPage: number;

    editDataHolder: any[];
    editDataIndex: number = -1;
  
    currObject: any = {};
    objFields: string[] = [];
    displayDialog = false;

    dataHolder: any;

    formData: PM;

    constructor(private service: QuestionService, private confirmationService: ConfirmationService) {}
  
    ngOnChanges() {
      if (!this.data) {
        this.initGrid();
      }
      else {
        this.setEmptyObject();
        this.objFields = Object.keys(this.currObject.fields);
        this.dataHolder = JSON.parse(JSON.stringify(this.data));
        this.setFormData();
      }
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
      const rowIndex = this.data.values.indexOf(rowData);
      this.currObject.rowIndex = rowIndex;
      this.currObject.fields = JSON.parse(JSON.stringify(rowData)); // Object.assign({}, rowData);
      
      this.form.form.reset({
        'age': this.currObject.fields.age.value,
        'name': this.currObject.fields.name.value,
        'date': this.currObject.fields.date.value,
        'city': this.currObject.fields.city.value
      });      

      this.displayDialog = true;
    }

    remove(data) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this row?',
        // rejectButtonStyleClass: 'fdsa',
        accept: () => {
          const deletedRow = this.data.values.indexOf(data);
          // - this.dt.first is for after the first page, because this.data contains all rows, and tableElement.rows contains only the visible rows.
          this.dt.domHandler.fadeOut(this.dt.tableViewChild.nativeElement.rows[deletedRow + 1 - this.dt.first], 300);
          setTimeout(() => {
            this.data.values.splice(deletedRow, 1);            
            this.refreshTable();
          }, 300);
        }
      });
    }

    saveDynamic(data) {
      // edit row
      if (this.currObject.rowIndex !== undefined) {
        const buttons = this.data.values[this.currObject.rowIndex].buttons;
        data.values.buttons = buttons;
        this.data.values[this.currObject.rowIndex] = data.values; 
      }
      // new row
      else {
        const buttons = this.data.headers.find((h) => h.id === 'buttons').buttons;
        data.values.buttons = buttons;
        this.data.values.push(data.values);
      }
      this.refreshTable();
      this.setEmptyObject();
      this.displayDialog = false;
      this.form.form.reset();
    }

    save() {
      const obj = Object.assign({}, this.currObject);
      // edit row
      if (this.currObject.rowIndex !== undefined) {
        this.data.values[this.currObject.rowIndex] = obj.fields;
      }
      // new row
      else {
        const buttons = this.data.headers.find((h) => h.id === 'buttons').buttons;
        obj.fields.buttons = buttons;
        this.data.values.push(obj.fields);
      }
      this.refreshTable();
      this.setEmptyObject();
      this.displayDialog = false;
    }

    setEmptyObject() {
      this.currObject.fields = {};
      this.data.headers.filter((c) => c.type !== 'buttons').forEach((c) => {
        // the space (' ') is needed for soap ui, that doesn't know to receive empty string ('') or null;
        this.currObject.fields[c.id] = { 'value': ' ' };
      });
      this.currObject.rowIndex = undefined;
    }
    
    addRow() {
      this.dialog.header = 'New row';
      this.displayDialog = true;
    }

    refreshTable() {
      // needed to update the number of pages etc.
      this.dt.totalRecords = this.data.values.length;
      this.dt.sortSingle();
    }

    customSort(event: SortEvent) {
      const column = this.data.headers.find(function(c) { return c.id === event.field });

      if (column['type'] === 'date') {
        event.data.sort((data1, data2) => {
          // changing dd/mm/yyyy to yyyymmdd (which is the format to sort dates).
          const value1 = +data1[event.field].value.split('/').reverse().join('');
          const value2 = +data2[event.field].value.split('/').reverse().join('');
          const result = value1 > value2 ? 1 : -1;
          return (event.order * result);
        });
      }
      else if (column['type'] === 'checkbox') {
        event.data.sort((data1, data2) => {
          const result = data1[event.field].value.toString() === 'true' ? 1 : -1;
          return (event.order * result);
        });
      }
      else if (column['type'] === 'number') {
        event.data.sort((data1, data2) => {
          // make no difference between number and number as strings
          const value1 = +data1[event.field].value;
          const value2 = +data2[event.field].value;
          const result = value1 > value2 ? 1 : -1;
          return (event.order * result);
        });
      }
      else {
        event.data.sort((data1, data2) => {
          // make no difference between number and number as strings
          const value1 = data1[event.field].value.toLowerCase();
          const value2 = data2[event.field].value.toLowerCase();
          const result = value1 > value2 ? 1 : -1;
          return (event.order * result);
        });
      }
    }

    cancel() {
      this.displayDialog = false;
      this.setEmptyObject();      
    }

    setValue(field: Field, value: any) {
      this.data[field.line][field.field] = value;
    }

    cancelChanges(): void {
      this.data = JSON.parse(JSON.stringify(this.dataHolder));
    }

    setFormData() {
      this.formData = new PM('form-' + this.data.id, 'TITLE', 'form');
      let num = 1;
      this.data.headers.filter((f) => f.type !== 'buttons').forEach((h) => {
        const field = { 'id': h.id, 'label': h.title, 'type': h.type };
        if (h.type === 'dropdown') {
          field['options'] = h.options;
        }
        this.formData.fieldRows.push({ 'id': num, 'fields': [ field ] });
        num++;
      });
    }
  }

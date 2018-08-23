import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
// import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { Grid } from './grid';
import { Column } from './column';

import { QuestionService } from './question.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, SortEvent, Message } from 'primeng/api';
import { Table } from 'primeng/table';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { ISetValue, Field } from '../interfaces';

@Component({
  selector: 'dynamic-grid-editable',
  templateUrl: './dynamic-grid-editable.component.html',
  styleUrls: [ './dynamic-grid-editable.component.css' ],
  // needed to load the css. https://github.com/angular/angular/issues/7845#issuecomment-302326549
  // encapsulation: ViewEncapsulation.None,
  providers: [ QuestionService, ConfirmationService ]
})
export class DynamicGridEditableComponent implements OnInit, OnChanges, ISetValue {    
  
  //#region Variables

  @ViewChild('dt') dt: Table

  @Input() gridKey: string;
  @Input() gridParameters: any = null;

  @Output() onClicked = new EventEmitter<any>();

  grid: Grid = new Grid({});
  data: any[];
  rowsInPage: number;
  selectedRows: any[] = [];
  addingNewRow = false;
  emptyObject: any = {};
  timeoutHolder: any;
  msgs: Message[] = [];
  results: object[];

  //#endregion Variables

  constructor(private service: QuestionService, private confirmationService: ConfirmationService) {}

  ngOnChanges() {
    this.initGrid();
  }

  ngOnInit() {
  
  }

  initGrid(): void {
    // load the grid definitions
    const loadingGrid = this.service.getGrid(this.gridKey, this.gridParameters);
    loadingGrid.then(response => {
      this.grid = response;
      this.setEmptyObject();
    });

    // load the grid data
    const loadingGridData = this.service.getGridData(this.gridKey, this.gridParameters);
    loadingGridData.then(response => {
      this.data = response;
    });
  }

  delete(event) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete these row/s?',
      accept: () => {
        this.selectedRows.forEach(row => {
          const deletedRow = this.data.indexOf(row);
          // - this.dt.first is for after the first page, because this.data contains all rows, and tableElement.rows contains only the visible rows.
          this.dt.domHandler.fadeOut(this.dt.tableViewChild.nativeElement.rows[deletedRow + 1 - this.dt.first], 300);
          setTimeout((_row) => {
            let _deletedRow = this.data.indexOf(_row);
            this.data.splice(_deletedRow, 1);            
            _deletedRow = this.selectedRows.indexOf(_row);
            this.selectedRows.splice(_deletedRow, 1);            
            this.dt.totalRecords = this.data.length;
          }, 300, row);
        });        
      }
    });
  }

  editInit(event) {
    if (!event.data[event.field].invalid) {
      event.data[event.field].valueHolder =  event.data[event.field].value;
    }
    clearTimeout(this.timeoutHolder);
    // in text input set the text to be selected
    if (event.data[event.field].fieldType === 'number' || event.data[event.field].fieldType === 'autocomplete') {
      this.timeoutHolder = setTimeout((cell) => {
        const input = cell.querySelector('input');
        input.setSelectionRange(0, +input.value.length);
      }, 100, this.dt.editingCell);
    }
    // other elements (dropdown, checkbox etc) - focus.
    else {
      this.timeoutHolder = setTimeout((cell) => {
        cell.children[0].children[0].focus();
      }, 100, this.dt.editingCell);
    }
  }

  editComplete(event) {
    const currData = Object.assign({ 'rowIndex': this.data.indexOf(event.data), 'field': event.field }, event.data[event.field]);
    this.msgs.length = 0;    
    // validation
    this.service.validateControl('EDITABLE', event.field, currData).then(response => {
      if (response['isValid'] === 'false') {
        // + 1 is because of the first radiobutton column
        const cellIndex = this.grid.columns.findIndex((a) => a.id === response['field']) + 1;
        // + 1 is because of the first row (thead)
        const rowIndex = +response['rowIndex'] + 1;
        const invalidCell = this.dt.tableViewChild.nativeElement.rows[rowIndex].cells[cellIndex];
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: response.message});
        event.data[event.field].invalid = true;
        // get focus back to invalid element.
        setTimeout((ec) => {
          ec.click();
        }, 100, invalidCell);
      }
      else {
        this.msgs.length = 0;
        event.data[event.field].invalid = false;
      }
    });
  }

  editCancel(event) {
    this.msgs.length = 0;
    event.data[event.field].value = event.data[event.field].valueHolder;
    event.data[event.field].invalid = false;
  }

  addNew(event) {
    const obj = JSON.parse(JSON.stringify(this.emptyObject));
    this.data = [obj, ...this.data ]; 
    this.addingNewRow = true;
    setTimeout(() => {
      // first row is the headers, first col is the radio button
      this.dt.tableViewChild.nativeElement.rows[1].cells[1].click();
    }, 100);
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      // keep the new row always first.
      if (data1['new-row']) {
        return -1;
      }
      // sorting by the value property
      const value1 = +data1[event.field].value;
      const value2 = +data2[event.field].value;
      const result = value1 > value2 ? 1 : -1;

      return (event.order * result);
    });
  }

  saveNewRow(event) {
    this.data[0]['new-row'] = false;
    this.addingNewRow = false;
    // if a cell is being edited in the new row, complete the editing (enter click).
    if (this.dt.editingCell && this.dt.editingCell.parentElement['rowIndex'] === 1) {
      const enterClick = new KeyboardEvent('keydown', { 'key': '13' } );
      // set the keyCode property. from: https://stackoverflow.com/questions/31785041/javascript-trigger-specific-keyboard-keys#answer-31785376
      Object.defineProperty(enterClick, 'keyCode', {
        value: enterClick.key
      });
      this.dt.editingCell.dispatchEvent(enterClick);
    }
  }
  
  cancelNewRow(event) {
    this.data = this.data.splice(1);
    this.addingNewRow = false;
  }

  setEmptyObject() {
    this.grid.columns.forEach((c) => {
      this.emptyObject[c.field] = { 'type': c.type, 'value': '' };
      if (c.type === 'select') {
        this.emptyObject[c.field].options = c['options'];
      }
      else if (c.type === 'checkbox') {
        this.emptyObject[c.field].value = false;
      }
    });
    this.emptyObject['new-row'] = true;
  }

  autoCompleteChange(event) {
    const q = event.query;
    const autoCompleteSearch = this.service.autoCompleteSearch('EDITABLEGRID', 'A', q);
    autoCompleteSearch.then(response => {
      this.results = response ? response : [];
    });
  }

  setValue(field: Field, value: any) {
      const col = this.grid.columns.filter((c) => c.id === field.field);
      //if (col['type'] === '') {}
      this.data[field.line][field.field].value = value;
      this.data[field.line][field.field].valueHolder = value;
      // const currValue = Object.assign({}, this.data[field.line][field.field]);
      // currValue.value = value;
      // currValue.valueHolder = value;
      // this.data[field.line][field.field] = currValue;    
  }

}

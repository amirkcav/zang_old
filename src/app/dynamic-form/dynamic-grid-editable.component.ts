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

@Component({
  selector: 'dynamic-grid-editable',
  templateUrl: './dynamic-grid-editable.component.html',
  styleUrls: [ './dynamic-grid-editable.component.css' ],
  // needed to load the css. https://github.com/angular/angular/issues/7845#issuecomment-302326549
  // encapsulation: ViewEncapsulation.None,
  providers: [ QuestionService, ConfirmationService ]
})
export class DynamicGridEditableComponent implements OnInit, OnChanges {    
  @ViewChild('dt') dt: Table

  @Input() gridKey: string;
  @Input() gridParameters: any = null;

  @Output() onClicked = new EventEmitter<any>();

  grid: Grid = new Grid({});
  data: any[];

  loadingGrid: Promise<Grid>;
  loadingGridData: Promise<any[]>;

  rowsInPage: number;

  editDataHolder: any;
  editDataIndex: number = -1;
  selectedRow: any[];
  addingNewRow = false;
  editingCellHolder: any;  
  isError: boolean;
  emptyObject: any = {};

  timeoutHolder: any;

  msgs: Message[] = [];

  autoCompleteSearch: Promise<any>;
  results: object[];

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

  delete(event) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        const deletedRow = this.data.indexOf(this.selectedRow);
        this.data.splice(deletedRow, 1);
        this.selectedRow = null;
        this.dt.totalRecords = this.data.length;
      }
    });
  }

  editInit(event) {
    if (!this.isError) {
      this.editDataHolder = Object.assign({}, event.data[event.field]);
      this.editDataIndex = this.data.indexOf(event.data);
      this.editingCellHolder = this.dt.editingCell;
    }
    clearTimeout(this.timeoutHolder);
    // in text input set the text to be selected
    if (!event.data[event.field].fieldType || event.data[event.field].fieldType === 'autocomplete') {
      this.timeoutHolder = setTimeout((cell) => {
        const input = cell.querySelector('input');
        input.setSelectionRange(0, +input.value.length);
      }, 100, this.dt.editingCell);
    }
    else {
      this.timeoutHolder = setTimeout((cell) => {
        cell.children[0].children[0].focus();
      }, 100, this.dt.editingCell);
    }
  }

  editComplete(event) {
    const currData = event.data[event.field];
    this.msgs.length = 0;    
    // validation
    if (isNaN(currData.value) && !currData.fieldType /*default text input*/) {
      this.isError = true;
      this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Validation failed'});
      this.dt.domHandler.addClass(this.editingCellHolder, 'invalid');
      currData.invalid = true;
      // get focus back to invalid element.
      setTimeout((ec) => {
        ec.click();
      }, 100, this.editingCellHolder);
    }
    else {
      this.isError = false;
      this.msgs.length = 0;
      currData.invalid = false;
    }
  }

  editCancel(event) {
      this.msgs.length = 0;
      this.data[this.editDataIndex][event.field] = this.editDataHolder;
      this.isError = false;
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
      this.emptyObject[c.field] = { 'value': '' };
    });
    this.emptyObject['new-row'] = true;
  }

  autoCompleteChange(event) {
    const q = event.query;
    this.autoCompleteSearch = this.service.autoCompleteSearch(
      'EDITABLEGRID',
      'A',
      q
    );
    this.autoCompleteSearch.then(response => {
      this.results = response ? response : [];
    });
  }

}

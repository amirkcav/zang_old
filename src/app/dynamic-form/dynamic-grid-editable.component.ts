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
import { ConfirmationService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';

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
    const v = event;
    this.editDataHolder = event.data[event.field];
    this.editDataIndex = this.data.indexOf(event.data);
  }

  editComplete(event) {
    const currData = event.data[event.field];
    if (isNaN(currData)) {
      this.data[this.editDataIndex][event.field] = this.editDataHolder;
      // alert ?
    }
    else {
      
    }
  }

  editCancel(event) {
    this.data[this.editDataIndex][event.field] = this.editDataHolder;
  }

  addNew(event) {
    this.data = [{ 'new-row': true }, ...this.data ]; 
    this.addingNewRow = true;
    setTimeout(() => {
      // first row is the headers
      this.dt.tableViewChild.nativeElement.rows[1].cells[1].click();
    }, 100);
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      // keep the new row always first.
      if (data1['new-row']) {
        return -1;
      }
      const value1 = +data1[event.field];
      const value2 = +data2[event.field];
      const result = value1 > value2 ? 1 : -1;

      return (event.order * result);
    });
  }

  saveNewRow(event) {
    this.data[0]['new-row'] = false;
    this.addingNewRow = false;
    const enterClick = new KeyboardEvent('keydown', { 'key': '13' } );
    // needed to set the keyCode property.
    // from: https://stackoverflow.com/questions/31785041/javascript-trigger-specific-keyboard-keys#answer-31785376
    Object.defineProperty(enterClick, 'keyCode', {
      value: enterClick.key
    });
    this.dt.editingCell.dispatchEvent(enterClick);
  }
  
  cancelNewRow(event) {
    this.data = this.data.splice(1);
    this.addingNewRow = false;
  }

}

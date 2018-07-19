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
  import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
  
  @Component({
    selector: 'dynamic-grid-b',
    templateUrl: './dynamic-grid-b.component.html',
    styleUrls: ['./dynamic-grid-b.component.css'],
    providers: [ QuestionService, ConfirmationService ]
  })
  export class DynamicGridBComponent implements OnInit, OnChanges {    
    @ViewChild('dt') dt: Table

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

    delete(id) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
          const deletedRow = this.data.indexOf(id);
          this.data.splice(deletedRow, 1);
          
        }
    });
    }
    
  }

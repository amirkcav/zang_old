import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges
  } from '@angular/core';
  import { FormGroup } from '@angular/forms';
  import { Subject } from 'rxjs/Subject';
  
  import { Grid } from './grid';
  import { Column } from './column';
  
  import { QuestionService } from './question.service';
  
  @Component({
    selector: 'dynamic-grid-b',
    templateUrl: './dynamic-grid-b.component.html',
    styleUrls: ['./dynamic-grid-b.component.css'],
    providers: [QuestionService]
  })
  export class DynamicGridBComponent implements OnInit, OnChanges {
    @Input() gridKey: string;
    @Input() gridParameters: any = null;
  
    @Output() onClicked = new EventEmitter<any>();
  
    grid: Grid = new Grid({});
    data: any[];
  
    loadingGrid: Promise<Grid>;
    loadingGridData: Promise<any[]>;
  
    constructor(private service: QuestionService) {}
  
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
  }

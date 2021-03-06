import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { QuestionBase } from './question-base';
//import { QuestionControlService } from './question-control.service';
import { QuestionService } from './question.service';
import { FileUploadQuestion } from './question-fileUpload';
import { Calendar } from 'primeng/calendar';

// import { MessageService } from 'primeng/components/common/messageservice';
import { AlertsService } from '../alerts.service'
import { MyLoaderService } from '../my-loader/my-loader.service';

@Component({
  selector: 'df-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.css'],
  providers: [QuestionService], 
  encapsulation: ViewEncapsulation.None
})
export class DynamicFormQuestionComponent implements OnInit, OnDestroy {  
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  @Input() validateOnBlur: boolean;

  @Input() formKey: string;

  autoCompleteSearch: Promise<any>;

  currYear: number = new Date().getFullYear();
  results: object[];

  // camera
  useCamera = false;
  stream: MediaStream;
  @ViewChild('videoElement') videoElement: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('capturedImageElem') capturedImageElem: ElementRef;  
  @ViewChild('calendar') calendar: Calendar;  
  capturedImage: any;
  cameraActive: boolean;
  canvasHeight: number;
  canvasWidth: number;
  uploadPicture: Promise<any>;
    
  dateFormat = 'dd/mm/yyyy';
  showDatepicker = false;

  closeDatepickerOnSelect = true;
  selectedDate: any;

  constructor(private service: QuestionService, private alertsService: AlertsService, private myLoaderService: MyLoaderService) { } 

  ngOnInit() {
    // this.useCamera = this.question.controlType === 'file-upload' && this.question.key === 'image';
    if (this.question.controlType === 'file-upload' && this.question['useCamera']) {
      // this.play();
      this.useCamera = true;
    }
  }

  ngOnDestroy(): void {
    if (this.cameraActive) {
      this.stop();
    }
  }

  get isInvalid() {
    const control = this.form.controls[this.question.key];
    if (!control) {
      return false;
    }
    return control.invalid && (control.dirty || control.touched);
  }

  get errors() {
    const control = this.form.controls[this.question.key];
    if (!control) {
      return {};  
    }
    return control.errors || {};
  }  

  autoCompleteChange(event) {
    const q = event.query;
    this.autoCompleteSearch = this.service.autoCompleteSearch(
      this.formKey,
      this.question.key,
      q
    );
    this.autoCompleteSearch.then(response => {
      this.results = response ? response : [];
    })
    .catch((err) => {
      this.alertsService.alert('error', 'אירעה שגיאה', err, false);
    });
  }

  autoCompleteSelect(event) {
    this.form.controls[this.question.key].setValue(event);
  }

  fileChange(event) {
    const tempQuestion = <FileUploadQuestion>this.question;
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
        const file: File = fileList[0];        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (file.type.indexOf('image') >= 0) {
            tempQuestion.image = reader.result;
          }
          else {
            tempQuestion.image = '';
          }
        };
    }
  }

  buttonClick(event) {
    /*click functionality*/      
  }

  //#region Camera

  play() {
    this.activateCamera({ video: { facingMode: 'environment' }, audio: false }); //, maxLength: 10, debug: true
  }

  activateCamera(config) {
    this.cameraActive = true;
    const browser = <any>navigator
    if (browser.mediaDevices && browser.mediaDevices.getUserMedia) {
      browser.mediaDevices.getUserMedia(config)
      .then(stream => {
        this.stream = stream;
        const video: HTMLVideoElement = this.videoElement.nativeElement;
        video.src = window.URL.createObjectURL(stream);
        video.play();
        setTimeout(() => {
          video.parentElement.style.height = video.clientHeight + 'px';
          video.parentElement.style.width = video.clientWidth + 'px';
          this.canvasHeight = video.clientHeight;
          this.canvasWidth = video.clientWidth;
          if (this.capturedImageElem) {
            this.capturedImageElem.nativeElement.style.height = video.clientHeight + 'px';
            this.capturedImageElem.nativeElement.style.width = video.clientWidth + 'px';
          }
        }, 500);
      })
      .catch((err) => {
        this.alertsService.alert('error', 'אירעה שגיאה בהפעלת המצלמה', err, false);
      });
    } else {
      alert('Video is not supported');
    }
  }
  
  stop() {
    this.cameraActive = false;
    this.stream.getVideoTracks().forEach((track) => { 
      track.stop();
    });
  }

  public capture() {
    const context = this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0, this.canvasWidth, this.canvasHeight);
    this.capturedImage = this.canvas.nativeElement.toDataURL('image/png');
    this.stop();

    // upload the file
    this.myLoaderService.show('מעלה תמונה. אנא המתן...');
    //this.service.uploadPicture(this.formKey, this.question.key, this.capturedImage).then((result) => {
    this.uploadPicture = this.service.uploadPicture(this.formKey, this.question.key, this.capturedImage);
    this.uploadPicture.then((result) => {
      this.myLoaderService.hide();
      // save file name from server
      this.form.value[this.question.key] = result.image;
      if (!this.form.dirty) {
        this.form.markAsDirty();
      }
    })
    .catch((err) => {
      this.myLoaderService.hide();
      this.alertsService.alert('error', 'אירעה שגיאה', err, false);
    });
  }

  //#endregion Camera

  //#region Date field

  onBlurDateField(event) {
    event.currentTarget.focus();
    setTimeout(function(){
      event.currentTarget.blur();
    }, 50);
  }

  completeMask(elem) {
    // is valid date
    const date = elem.value; // this.form.controls[this.question.key].value; // event.target.value;
    const dateArr = date.split('/');
    const partsArr = this.dateFormat.split('/');
    const day = +dateArr[partsArr.indexOf('dd')];    
    const month = +dateArr[partsArr.indexOf('mm')] - 1; // month value is by index
    const year = +dateArr[partsArr.indexOf('yyyy')];
    const dateObj = new Date(year, month, day);
    // if you set days to more than 30 it gets to the next month. same for month (more than 11). 
    // for example new Date(99,99,2000) is a valid date (resulting in 2012). checking that this is not the case.
    if (date !== '' && (isNaN(dateObj.getDate()) || dateObj.getMonth() !== month || dateObj.getFullYear() !== year)) { 
      this.question['invalid'] = true;
      elem.el.nativeElement.focus();
      console.log('invalid');
    }
    else {
      this.question['invalid'] = false;
      this.showDatepicker = false;
      console.log('VVV');
    }
  }

  maskFocus(event) {
    this.showDatepicker = true;
  }

  datepickerSelect(event) {
    const fDate = event.format('dd/mm/yyyy');
    this.form.controls[this.question.key].setValue(fDate);
    this.question['invalid'] = false;
    if (this.closeDatepickerOnSelect) {
      this.showDatepicker = false;
    }
    else {
      this.closeDatepickerOnSelect = true;
    }
  }

  showCalendarClick(event) {
    this.showDatepicker = !this.showDatepicker;
    const dateValue = this.form.controls[this.question.key].value;
    if (this.showDatepicker && dateValue.trim() /* initial value is " " */ ) {
      const dateArr = dateValue.split('/');
      const partsArr = this.dateFormat.split('/');
      const day = +dateArr[partsArr.indexOf('dd')];    
      const month = +dateArr[partsArr.indexOf('mm')] - 1; // month value is by index
      const year = +dateArr[partsArr.indexOf('yyyy')];
      this.selectedDate = new Date(year, month, day);
      setTimeout(() => {
        this.closeDatepickerOnSelect = false;
        this.calendar.selectDate({ year: year, month: month, day: day });
      }, 50);
    }
  }

  //#endregion Date field

}

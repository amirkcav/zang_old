import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { QuestionBase } from './question-base';
//import { QuestionControlService } from './question-control.service';
import { QuestionService } from './question.service';
import { FileUploadQuestion } from './question-fileUpload';

@Component({
  selector: 'df-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.css'],
  providers: [QuestionService]
})
export class DynamicFormQuestionComponent implements OnInit {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  @Input() validateOnBlur: boolean;

  @Input() formKey: string;

  autoCompleteSearch: Promise<any>;

  currYear: number = new Date().getFullYear();
  results: object[];

  useCamera = true;
  // camera
  stream: MediaStream;
  @ViewChild('videoElement') videoElement: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  capturedImage: any;
  cameraActive: boolean;

  constructor(private service: QuestionService) {}  

  ngOnInit() {
    this.useCamera = this.question.key === 'image';
    if (this.question.controlType === 'file-upload' && this.useCamera /* && this.question['useCamera'] */) {
      this.play();
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
    });
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

  play() {
    this.activateCamera({ video: true, audio: false, maxLength: 10, debug: true });
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
        });
    } else {
      alert('Video is not supported');
    }
  }
  
  stop() {
    this.cameraActive = false;
    const stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());

    const video: HTMLVideoElement = this.videoElement.nativeElement;
    video.src = window.URL.createObjectURL(stream);
    video.pause();
  }

  public capture() {
      const context = this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0, 640, 480);
      this.capturedImage = this.canvas.nativeElement.toDataURL('image/png');
      this.cameraActive = false;
      this.stop();
  }

  changeUseCamera(event) {
    this.useCamera = event.target.checked;
    if (this.useCamera) {
      this.play();
    }
    else if (this.cameraActive) {
      this.stop();
    }
  }

}

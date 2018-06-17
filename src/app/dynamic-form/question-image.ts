import { QuestionBase } from './question-base';

export class ImageQuestion extends QuestionBase<string> {
  controlType = 'image';
  imageSrc: any;  

  constructor(options: {} = {}) {    
    super(options);
    this.imageSrc = options['url'];
  }
}

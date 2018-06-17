import { QuestionBase } from './question-base';

export class FileUploadQuestion extends QuestionBase<string> {
  controlType = 'file-upload';
  image: any;
  url: string;
  multiple: boolean;

  constructor(options: {} = {}) {    
    super(options);
    this.url = options['url'] ? options['url'] : '';
    this.multiple = options['multiple'];
  }
}

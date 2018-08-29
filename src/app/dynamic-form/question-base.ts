
export class QuestionBase<T> {
  value: T;
  id: string;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  readonly: boolean;
  visible: boolean;
  width: number;

  widthClass() {
    let widthClass = 'ui-lg-';
    if (!this.width) {
      widthClass += 12;
    }
    if (this.width % 33 === 0) {
      widthClass += 4 * (this.width / 33);
    }
    else {
      widthClass += 12 * this.width / 100;
    }
    return widthClass;
  }

  constructor(options: {
      value?: T,
      id?: string,
      label?: string,
      required?: boolean,
      order?: number,
      controlType?: string,
      readonly?: boolean,
      visible?: boolean,
      width?: number
    } = {}) {
    this.value = options.value;
    this.id = options.id || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.readonly = !!options.readonly;
    this.visible = options.visible === undefined ? true : options.visible;
    this.width = options.width || 100;
  }
}

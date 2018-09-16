import { Page } from '../dynamic-page/dynamic-page.model'
import { IDynamicComponent } from '../interfaces';

export class App {
  id: string;
  job: string;
  title: string;
  icon: string;
  pages: Page[];
  components: { [id: number]: IDynamicComponent } = {};
  isRtl = false;

  constructor(id?, job?, title?, icon?, pages?, isRtl?) {
    this.id = id;
    this.job = job;
    this.title = title;
    this.icon = icon;
    this.pages = new Array<Page>();
    this.isRtl = isRtl;
    pages.forEach(p => {
      this.pages.push(new Page(p.id, p.title, p.disabled, p.pmRows));
    });
  }
}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicMultiAppsComponent } from './dynamic-multi-apps.component';

describe('DynamicMultiAppsComponent', () => {
  let component: DynamicMultiAppsComponent;
  let fixture: ComponentFixture<DynamicMultiAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicMultiAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicMultiAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

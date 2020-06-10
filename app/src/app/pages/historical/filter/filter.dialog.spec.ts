import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDataDialog } from './filter.dialog';

describe('FilterDataDialog', () => {
  let component: FilterDataDialog;
  let fixture: ComponentFixture<FilterDataDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterDataDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDataDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

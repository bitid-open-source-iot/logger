import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalPage } from './historical.page';

describe('HistoricalPage', () => {
  let component: HistoricalPage;
  let fixture: ComponentFixture<HistoricalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

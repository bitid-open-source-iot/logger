import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggerEditorPage } from './editor.page';

describe('LoggerEditorPage', () => {
  let component: LoggerEditorPage;
  let fixture: ComponentFixture<LoggerEditorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggerEditorPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggerEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

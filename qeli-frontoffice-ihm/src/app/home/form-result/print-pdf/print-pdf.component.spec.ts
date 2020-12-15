import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPdfComponent } from './print-pdf.component';

describe('PrintPdfComponent', () => {
  let component: PrintPdfComponent;
  let fixture: ComponentFixture<PrintPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

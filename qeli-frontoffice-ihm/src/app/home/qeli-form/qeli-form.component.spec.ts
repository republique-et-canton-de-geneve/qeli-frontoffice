import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QeliFormComponent } from './qeli-form.component';

describe('QeliFormComponent', () => {
  let component: QeliFormComponent;
  let fixture: ComponentFixture<QeliFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QeliFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QeliFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepLinkComponent } from './deep-link.component';

describe('DeepLinkComponent', () => {
  let component: DeepLinkComponent;
  let fixture: ComponentFixture<DeepLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeepLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeepLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaAllComponent } from './proforma-all.component';

describe('ProformaAllComponent', () => {
  let component: ProformaAllComponent;
  let fixture: ComponentFixture<ProformaAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProformaAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

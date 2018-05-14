import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaCreateComponent } from './proforma-create.component';

describe('ProformaCreateComponent', () => {
  let component: ProformaCreateComponent;
  let fixture: ComponentFixture<ProformaCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProformaCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

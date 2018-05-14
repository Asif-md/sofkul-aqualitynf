import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaSearchComponent } from './proforma-search.component';

describe('ProformaSearchComponent', () => {
  let component: ProformaSearchComponent;
  let fixture: ComponentFixture<ProformaSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProformaSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

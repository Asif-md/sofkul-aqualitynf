import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaRecentComponent } from './proforma-recent.component';

describe('ProformaRecentComponent', () => {
  let component: ProformaRecentComponent;
  let fixture: ComponentFixture<ProformaRecentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProformaRecentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

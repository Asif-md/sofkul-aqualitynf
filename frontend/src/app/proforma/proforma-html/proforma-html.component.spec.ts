import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaHtmlComponent } from './proforma-html.component';

describe('ProformaHtmlComponent', () => {
  let component: ProformaHtmlComponent;
  let fixture: ComponentFixture<ProformaHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProformaHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

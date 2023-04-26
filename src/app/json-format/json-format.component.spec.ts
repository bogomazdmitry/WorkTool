import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonFormatComponent } from './json-format.component';

describe('JsonFormatComponent', () => {
  let component: JsonFormatComponent;
  let fixture: ComponentFixture<JsonFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonFormatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffTextComponent } from './diff-text.component';

describe('DiffTextComponent', () => {
  let component: DiffTextComponent;
  let fixture: ComponentFixture<DiffTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiffTextComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeChangerComponent } from './theme-changer.component';

describe('ThemeChangerComponent', () => {
  let component: ThemeChangerComponent;
  let fixture: ComponentFixture<ThemeChangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeChangerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

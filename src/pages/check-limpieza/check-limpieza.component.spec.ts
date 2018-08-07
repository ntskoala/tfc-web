import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckLimpiezaComponent } from './check-limpieza.component';

describe('CheckLimpiezaComponent', () => {
  let component: CheckLimpiezaComponent;
  let fixture: ComponentFixture<CheckLimpiezaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckLimpiezaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckLimpiezaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

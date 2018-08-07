import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletarFechasComponent } from './completar-fechas.component';

describe('CompletarFechasComponent', () => {
  let component: CompletarFechasComponent;
  let fixture: ComponentFixture<CompletarFechasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletarFechasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletarFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

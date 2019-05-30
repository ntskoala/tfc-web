import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosEntradaComponent } from './servicios-entrada.component';

describe('ServiciosEntradaComponent', () => {
  let component: ServiciosEntradaComponent;
  let fixture: ComponentFixture<ServiciosEntradaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosEntradaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

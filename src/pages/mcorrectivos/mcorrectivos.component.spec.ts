import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McorrectivosComponent } from './mcorrectivos.component';

describe('McorrectivosComponent', () => {
  let component: McorrectivosComponent;
  let fixture: ComponentFixture<McorrectivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McorrectivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McorrectivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

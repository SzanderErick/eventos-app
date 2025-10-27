import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEvento } from './form-evento';

describe('FormEvento', () => {
  let component: FormEvento;
  let fixture: ComponentFixture<FormEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEvento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEvento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

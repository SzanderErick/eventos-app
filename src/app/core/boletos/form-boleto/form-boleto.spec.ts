import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBoleto } from './form-boleto';

describe('FormBoleto', () => {
  let component: FormBoleto;
  let fixture: ComponentFixture<FormBoleto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBoleto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormBoleto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

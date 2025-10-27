import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMantel } from './form-mantel';

describe('FormMantel', () => {
  let component: FormMantel;
  let fixture: ComponentFixture<FormMantel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMantel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMantel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

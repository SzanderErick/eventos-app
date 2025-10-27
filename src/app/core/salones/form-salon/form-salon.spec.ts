import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSalon } from './form-salon';

describe('FormSalon', () => {
  let component: FormSalon;
  let fixture: ComponentFixture<FormSalon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSalon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSalon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

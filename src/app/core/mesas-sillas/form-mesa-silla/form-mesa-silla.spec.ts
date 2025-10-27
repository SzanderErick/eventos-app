import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMesaSilla } from './form-mesa-silla';

describe('FormMesaSilla', () => {
  let component: FormMesaSilla;
  let fixture: ComponentFixture<FormMesaSilla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMesaSilla]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMesaSilla);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

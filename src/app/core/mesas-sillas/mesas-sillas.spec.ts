import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesasSillas } from './mesas-sillas';

describe('MesasSillas', () => {
  let component: MesasSillas;
  let fixture: ComponentFixture<MesasSillas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesasSillas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesasSillas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

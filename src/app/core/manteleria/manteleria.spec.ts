import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Manteleria } from './manteleria';

describe('Manteleria', () => {
  let component: Manteleria;
  let fixture: ComponentFixture<Manteleria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Manteleria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Manteleria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

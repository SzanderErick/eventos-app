import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarMantel } from './asignar-mantel';

describe('AsignarMantel', () => {
  let component: AsignarMantel;
  let fixture: ComponentFixture<AsignarMantel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarMantel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarMantel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

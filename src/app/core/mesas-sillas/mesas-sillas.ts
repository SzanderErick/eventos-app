import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MesaSillaService } from '../../service/mesa-silla.service';
import { SalonService } from '../../service/salon.service';
import { Observable } from 'rxjs';
import { Mesa } from '../../models/mesa.model';
import { Salon } from '../../models/salon.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mesas-sillas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mesas-sillas.html',
  styleUrls: ['./mesas-sillas.css'],
})
export class MesasSillasComponent {
  private mesaSrv = inject(MesaSillaService);
  private salonSrv = inject(SalonService);
  private router = inject(Router);

  salones$: Observable<Salon[]> = this.salonSrv.listar();
  mesas$!: Observable<Mesa[]>;
  salonId = '';

  onSalonChange() {
    if (this.salonId) this.mesas$ = this.mesaSrv.listarPorSalon(this.salonId);
  }

  nueva() {
    if (this.salonId)
      this.router.navigate(['/mesas-sillas/nueva'], { queryParams: { salonId: this.salonId } });
  }

  editar(id: string) { this.router.navigate(['/mesas-sillas', id]); }

  async borrar(id: string) {
    if (confirm('¿Eliminar mesa?')) await this.mesaSrv.eliminar(id);
    this.onSalonChange();
  }
}

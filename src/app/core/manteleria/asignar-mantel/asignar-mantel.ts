import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignacionMantelService } from '../../../service/asignacion-mantel.service';
import { MantelService } from '../../../service/mantel.service';
import { SalonService } from '../../../service/salon.service';
import { MesaSillaService } from '../../../service/mesa-silla.service';
import { Observable } from 'rxjs';
import { Mantel } from '../../../models/mantel.model';
import { Salon } from '../../../models/salon.model';
import { Mesa } from '../../../models/mesa.model';

@Component({
  selector: 'app-asignar-mantel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asignar-mantel.html',
  styleUrls: ['./asignar-mantel.css'],
})
export class AsignarMantelComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private asigSrv = inject(AsignacionMantelService);
  private mantelSrv = inject(MantelService);
  private salonSrv = inject(SalonService);
  private mesaSrv = inject(MesaSillaService);

  salones$: Observable<Salon[]> = this.salonSrv.listar();
  manteles$: Observable<Mantel[]> = this.mantelSrv.listar();
  mesas$: Observable<Mesa[]> | null = null;

  salonId = '';
  mesaId = '';
  mantelId = '';
  cantidad = 1;
  error = '';

  ngOnInit() {
    const qp = this.route.snapshot.queryParamMap.get('salonId');
    if (qp) {
      this.salonId = qp;
      this.mesas$ = this.mesaSrv.listarPorSalon(this.salonId);
    }
  }

  onSalonChange() {
    this.mesaId = '';
    this.mesas$ = this.salonId ? this.mesaSrv.listarPorSalon(this.salonId) : null;
  }

  async guardar() {
    this.error = '';
    try {
      if (!this.salonId || !this.mesaId || !this.mantelId || this.cantidad < 1) {
        this.error = 'Completa salón, mesa, mantel y cantidad válida';
        return;
      }
      await this.asigSrv.crear({
        salonId: this.salonId,
        mesaId: this.mesaId,           // requerido por el modelo
        mantelId: this.mantelId,
        cantidad: this.cantidad,
      });
      this.router.navigate(['/manteleria'], { queryParams: { salonId: this.salonId } });
    } catch (e: any) {
      this.error = e?.message ?? 'Error al asignar';
    }
  }

  cancelar() {
    this.router.navigate(['/manteleria'], { queryParams: { salonId: this.salonId } });
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MantelService } from '../../service/mantel.service';
import { AsignacionMantelService } from '../../service/asignacion-mantel.service';
import { SalonService } from '../../service/salon.service';
import { MesaSillaService } from '../../service/mesa-silla.service';
import { Observable } from 'rxjs';
import { Mantel } from '../../models/mantel.model';
import { AsignacionMantel } from '../../models/asignacion-mantel.model';
import { Salon } from '../../models/salon.model';
import { Mesa } from '../../models/mesa.model';

@Component({
  selector: 'app-manteleria',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manteleria.html',
  styleUrls: ['./manteleria.css'],
})
export class ManteleriaComponent {
  private mantelSrv = inject(MantelService);
  private asigSrv = inject(AsignacionMantelService);
  private salonSrv = inject(SalonService);
  private mesaSrv = inject(MesaSillaService);

  manteles$: Observable<Mantel[]> = this.mantelSrv.listar();
  salones$: Observable<Salon[]> = this.salonSrv.listar();

  salonId = '';
  mesaId = '';
  mesas$: Observable<Mesa[]> | null = null;

  asignaciones$!: Observable<AsignacionMantel[]>;

  form = { mantelId: '', cantidad: 1 };
  error = '';

  onSalonChange() {
    this.mesaId = '';
    this.mesas$ = this.salonId ? this.mesaSrv.listarPorSalon(this.salonId) : null;
    this.asignaciones$ = this.salonId ? this.asigSrv.listarPorSalon(this.salonId) : (null as any);
  }

  onMesaChange() {
    if (this.salonId && this.mesaId) {
      this.asignaciones$ = this.asigSrv.listarPorSalonYMesa(this.salonId, this.mesaId);
    } else if (this.salonId) {
      this.asignaciones$ = this.asigSrv.listarPorSalon(this.salonId);
    }
  }

  async guardarAsignacion() {
    this.error = '';
    try {
      if (!this.salonId || !this.mesaId || !this.form.mantelId || this.form.cantidad < 1) {
        this.error = 'Selecciona salón, mesa, mantel y cantidad válida';
        return;
      }
      await this.asigSrv.crear({
        salonId: this.salonId,
        mesaId: this.mesaId,
        mantelId: this.form.mantelId,
        cantidad: this.form.cantidad
      });
      this.onMesaChange();
      this.form = { mantelId: '', cantidad: 1 };
    } catch (e: any) {
      this.error = e?.message ?? 'Error al asignar';
    }
  }

  async eliminarAsignacion(id: string) {
    if (!id) return;
    const ok = confirm('¿Eliminar asignación?');
    if (!ok) return;
    await this.asigSrv.eliminar(id);
    this.onMesaChange();
  }

  async eliminarMantel(id: string) {
    if (!id) return;
    const ok = confirm('¿Eliminar mantel del inventario? Esta acción es permanente.');
    if (!ok) return;
    await this.mantelSrv.eliminar(id);
  }

  nombreMantel(mantelId: string, manteles: Mantel[] | null | undefined): string {
    const m = manteles?.find(x => x.id === mantelId);
    return m ? m.nombre : mantelId;
  }

  labelMesa(mesaId: string, mesas: Mesa[] | null | undefined): string {
    const ms = mesas ?? [];
    const m = ms.find(x => x.id === mesaId);
    return m ? `Mesa ${m.numero} (${m.forma})` : mesaId;
  }
}

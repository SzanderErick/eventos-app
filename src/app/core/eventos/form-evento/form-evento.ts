import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../../../service/evento.service';
import { SalonService } from '../../../service/salon.service';
import { Evento } from '../../../models/evento.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-evento.html',
  styleUrls: ['./form-evento.css'],
})
export class FormEventoComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventoSrv = inject(EventoService);
  private salonSrv = inject(SalonService);

  id: string | null = null;
  salones$ = this.salonSrv.listar();
  error = '';

  model: Evento = {
    titulo: '',
    fecha: new Date().toISOString().substring(0,10),
    salonId: '',
    aforoMax: 0,
    descripcion: '',
    publicado: false,
  };

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      const e = await firstValueFrom(this.eventoSrv.obtener(this.id));
      this.model = { ...e };
      this.model.fecha = e.fecha?.substring(0,10) ?? new Date().toISOString().substring(0,10);
    }
  }

  async guardar() {
    this.error = '';
    try {
      const payload = { ...this.model, fecha: new Date(this.model.fecha).toISOString() };
      if (this.id) await this.eventoSrv.actualizar(this.id, payload);
      else await this.eventoSrv.crear(payload);
      this.router.navigate(['/eventos']);
    } catch (e: any) {
      this.error = e?.message ?? 'Error al guardar';
    }
  }

  cancelar() { this.router.navigate(['/eventos']); }
}

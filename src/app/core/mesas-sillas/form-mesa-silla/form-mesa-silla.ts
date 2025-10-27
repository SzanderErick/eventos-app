import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MesaSillaService } from '../../../service/mesa-silla.service';
import { SalonService } from '../../../service/salon.service';
import { Mesa } from '../../../models/mesa.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-mesa-silla',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-mesa-silla.html',
  styleUrls: ['./form-mesa-silla.css'],
})
export class FormMesaSillaComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mesaSrv = inject(MesaSillaService);
  private salonSrv = inject(SalonService);

  id: string | null = null;
  salones$ = this.salonSrv.listar();
  error = '';

  model: Mesa = {
    salonId: '',
    numero: 1,
    sillas: 4,
    forma: 'redonda',
    estado: 'disponible',
  };

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    const qpSalon = this.route.snapshot.queryParamMap.get('salonId');
    if (qpSalon) this.model.salonId = qpSalon;
    if (this.id) {
      const m = await firstValueFrom(this.mesaSrv.obtener(this.id));
      this.model = { ...m };
    }
  }

  async guardar() {
    this.error = '';
    try {
      if (this.id) await this.mesaSrv.actualizar(this.id, this.model);
      else await this.mesaSrv.crear(this.model);
      this.router.navigate(['/mesas-sillas'], { queryParams: { salonId: this.model.salonId }});
    } catch (e: any) {
      this.error = e?.message ?? 'Error al guardar';
    }
  }

  cancelar() { this.router.navigate(['/mesas-sillas']); }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalonService } from '../../../service/salon.service';
import { Salon } from '../../../models/salon.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-salon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-salon.html',
  styleUrls: ['./form-salon.css'],
})
export class FormSalonComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private salonSrv = inject(SalonService);

  id: string | null = null;

  model: Salon = {
    nombre: '',
    capacidad: 0,
    ubicacion: '',
    descripcion: '',
    activo: true,
  };

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      const s = await firstValueFrom(this.salonSrv.obtener(this.id));
      this.model = { ...s };
    }
  }

  async guardar() {
    if (!this.model.nombre || this.model.capacidad <= 0 || !this.model.ubicacion) return;
    if (this.id) await this.salonSrv.actualizar(this.id, this.model);
    else await this.salonSrv.crear(this.model);
    this.router.navigate(['/salones']);
  }

  cancelar() { this.router.navigate(['/salones']); }
}

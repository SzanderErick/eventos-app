import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MantelService } from '../../../service/mantel.service';
import { Mantel } from '../../../models/mantel.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-mantel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-mantel.html',
  styleUrls: ['./form-mantel.css'],
})
export class FormMantelComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mantelSrv = inject(MantelService);

  id: string | null = null;

  model: Mantel = {
    nombre: '',
    color: '',
    tipo: 'tela',
    stockTotal: 0,
    activo: true,
  };

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      const m = await firstValueFrom(this.mantelSrv.obtener(this.id));
      this.model = { ...m };
    }
  }

  async guardar() {
    if (this.id) await this.mantelSrv.actualizar(this.id, this.model);
    else await this.mantelSrv.crear(this.model);
    this.router.navigate(['/manteleria']);
  }

  cancelar() { this.router.navigate(['/manteleria']); }
}
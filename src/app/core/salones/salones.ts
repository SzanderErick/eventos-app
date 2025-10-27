import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SalonService } from '../../service/salon.service';
import { Salon } from '../../models/salon.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-salones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salones.html',
  styleUrls: ['./salones.css'],
})
export class SalonesComponent {
  private salonSrv = inject(SalonService);
  private router = inject(Router);

  salones$: Observable<Salon[]> = this.salonSrv.listar();

  nuevo() { this.router.navigate(['/salones/nuevo']); }
  editar(id: string) { this.router.navigate(['/salones', id]); }
  async borrar(id: string) {
    if (confirm('¿Eliminar salón?')) await this.salonSrv.eliminar(id);
  }
}

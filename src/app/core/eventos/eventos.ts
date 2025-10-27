import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventoService } from '../../service/evento.service';
import { SalonService } from '../../service/salon.service';
import { AuthService } from '../../service/auth.service';
import { Observable } from 'rxjs';
import { Evento } from '../../models/evento.model';
import { Salon } from '../../models/salon.model';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eventos.html',
  styleUrls: ['./eventos.css'],
})
export class EventosComponent {
  private router = inject(Router);
  private eventoSrv = inject(EventoService);
  private salonSrv = inject(SalonService);
  private auth = inject(AuthService);

  eventos$: Observable<Evento[]> = this.eventoSrv.listar();
  salones$: Observable<Salon[]> = this.salonSrv.listar();

  get user() { return this.auth.currentUser(); }

  nuevo() { this.router.navigate(['/eventos/nuevo']); }
  editar(id: string) { this.router.navigate(['/eventos', id]); }
  async togglePublicar(e: Evento) { await this.eventoSrv.actualizar(e.id!, { publicado: !e.publicado }); }

  comprar(eventoId: string) {
    this.router.navigate(['/boletos/disponibles'], { queryParams: { eventoId } });
  }

  nombreSalon(id: string, salones: Salon[] | null | undefined) {
    const s = (salones ?? []).find(x => x.id === id);
    return s ? s.nombre : id;
  }
}

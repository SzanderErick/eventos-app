import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketPublicadoService } from '../../../service/ticket-publicado.service';
import { EventoService } from '../../../service/evento.service';
import { Observable } from 'rxjs';
import { Evento } from '../../../models/evento.model';

@Component({
  selector: 'app-form-publicar-boleto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-publicar-boleto.html',
  styleUrls: ['./form-publicar-boleto.css'],
})
export class FormPublicarBoletoComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pubSrv = inject(TicketPublicadoService);
  private eventoSrv = inject(EventoService);

  eventos$: Observable<Evento[]> = this.eventoSrv.listar();

  model = { eventoId: '', mesaId: '', precio: 0 };
  error = '';

  ngOnInit() {
    const qp = this.route.snapshot.queryParamMap.get('eventoId');
    if (qp) this.model.eventoId = qp;
  }

  async publicar() {
    this.error = '';
    try {
      if (!this.model.eventoId || !this.model.mesaId || this.model.precio <= 0) {
        throw new Error('Completa evento, mesa y un precio válido');
      }
      await this.pubSrv.crear(this.model);
      this.router.navigate(['/boletos']);
    } catch (e: any) {
      this.error = e?.message ?? 'No se pudo publicar';
    }
  }

  cancelar() { this.router.navigate(['/boletos']); }
}

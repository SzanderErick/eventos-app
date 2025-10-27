import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BoletoService } from '../../../service/boleto.service';
import { EventoService } from '../../../service/evento.service';
import { AuthService } from '../../../service/auth.service';
import { Observable } from 'rxjs';
import { Evento } from '../../../models/evento.model';

@Component({
  selector: 'app-form-boleto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-boleto.html',
  styleUrls: ['./form-boleto.css'],
})
export class FormBoletoComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private boletoSrv = inject(BoletoService);
  private eventoSrv = inject(EventoService);
  private auth = inject(AuthService);

  eventos$: Observable<Evento[]> = this.eventoSrv.listar();

  model = {
    eventoId: '',
    comprador: '',
    precio: 0,
  };
  error = '';
  esCliente = false;

  ngOnInit() {
    const qp = this.route.snapshot.queryParamMap.get('eventoId');
    if (qp) this.model.eventoId = qp;

    const user = this.auth.currentUser();
    this.esCliente = user?.rol === 'cliente';
    if (this.esCliente) {
      this.model.comprador = user?.username ?? '';
    }
  }

  async guardar() {
    this.error = '';
    try {
    
      if (this.esCliente) {
        if (!this.model.eventoId) throw new Error('Selecciona un evento');
        await this.boletoSrv.crear({
          eventoId: this.model.eventoId,
          comprador: this.model.comprador,
          precio: this.model.precio || 0,
        } as any);
        this.router.navigate(['/mis-boletos']);
        return;
      }

      
      if (!this.model.eventoId || !this.model.comprador || this.model.precio <= 0) {
        throw new Error('Completa evento, comprador y un precio válido');
      }
      await this.boletoSrv.crear(this.model);
      this.router.navigate(['/boletos'], { queryParams: { eventoId: this.model.eventoId } });
    } catch (e: any) {
      this.error = e?.message ?? 'Error al vender boleto';
    }
  }

  cancelar() {
    if (this.esCliente) this.router.navigate(['/eventos']);
    else this.router.navigate(['/boletos']);
  }
}

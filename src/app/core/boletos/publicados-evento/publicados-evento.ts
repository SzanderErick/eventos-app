import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketPublicadoService } from '../../../service/ticket-publicado.service';
import { BoletoService } from '../../../service/boleto.service';
import { AuthService } from '../../../service/auth.service';
import { Observable, of } from 'rxjs';
import { TicketPublicado } from '../../../models/ticket-publicado.model';

@Component({
  selector: 'app-publicados-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publicados-evento.html',
  styleUrls: ['./publicados-evento.css'],
})
export class PublicadosEventoComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pubSrv = inject(TicketPublicadoService);
  private boletosSrv = inject(BoletoService);
  private auth = inject(AuthService);

  eventoId = this.route.snapshot.queryParamMap.get('eventoId') ?? '';
  publicados$: Observable<TicketPublicado[]> = of([]);
  sinEvento = false;

  ngOnInit() {
    const user = this.auth.currentUser();
    console.log('PublicadosEvento init:', { eventoId: this.eventoId, user });

    if (user?.rol !== 'cliente') {
      this.router.navigate(['/home']);
      return;
    }

    if (!this.eventoId) {
      this.sinEvento = true;
      this.publicados$ = of([]);
      return;
    }
    this.publicados$ = this.pubSrv.listarPorEvento(this.eventoId);
  }

  async comprar(p: TicketPublicado) {
    const user = this.auth.currentUser();
    if (!user) return;
    await this.boletosSrv.crear({
      eventoId: p.eventoId,
      comprador: user.username,
      precio: p.precio,
    } as any);
    this.router.navigate(['/mis-boletos']);
  }
}

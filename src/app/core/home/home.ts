import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { EventoService } from '../../service/evento.service';
import { TicketPublicadoService } from '../../service/ticket-publicado.service';
import { BoletoService } from '../../service/boleto.service';
import { Observable, map, of, firstValueFrom } from 'rxjs';
import { Evento } from '../../models/evento.model';
import { TicketPublicado } from '../../models/ticket-publicado.model';
import { Boleto } from '../../models/boleto.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private eventosSrv = inject(EventoService);
  private pubSrv = inject(TicketPublicadoService);
  private boletosSrv = inject(BoletoService);

  user = this.auth.currentUser();

  proximosEventos$: Observable<Evento[]> =
    this.eventosSrv?.listar()?.pipe(
      map(list => list
        .filter(e => e.publicado)
        .sort((a, b) => (new Date(a.fecha).getTime()) - (new Date(b.fecha).getTime()))
        .slice(0, 5)
      )
    ) ?? of([]);

  publicacionesRecientes$: Observable<TicketPublicado[]> =
    this.pubSrv?.listar()?.pipe(
      map(list => list
        .sort((a, b) => (new Date(b.creadoEn).getTime()) - (new Date(a.creadoEn).getTime()))
        .slice(0, 5)
      )
    ) ?? of([]);

  misUltimosBoletos$: Observable<Boleto[]> | null =
    this.user?.rol === 'cliente'
      ? this.boletosSrv.listarPorComprador(this.user.username).pipe(
          map(list => list
            .sort((a, b) => (new Date(b.creadoEn).getTime()) - (new Date(a.creadoEn).getTime()))
            .slice(0, 5)
          )
        )
      : null;

  metricas$ = this.user?.rol === 'agente'
    ? this.eventosSrv.listar().pipe(
        map(evts => {
          const totalEventos = evts.length;
          const publicados = evts.filter(e => e.publicado).length;
          return { totalEventos, publicados };
        })
      )
    : null;

  private titulos = new Map<string, string>();

  async ngOnInit() {
    const evs = await firstValueFrom(this.eventosSrv.listar());
    evs.forEach(e => this.titulos.set(e.id!, e.titulo));
  }

  mostrarTitulo(id: string): string {
    const hit = this.titulos.get(id);
    if (hit) return hit;
    this.tituloEvento(id);
    return id;
  }

  private async tituloEvento(id: string): Promise<string> {
    if (this.titulos.has(id)) return this.titulos.get(id)!;
    const evs = await firstValueFrom(this.eventosSrv.listar());
    evs.forEach(e => this.titulos.set(e.id!, e.titulo));
    return this.titulos.get(id) ?? id;
  }

  get esAgente() { return this.user?.rol === 'agente'; }
  get esCliente() { return this.user?.rol === 'cliente'; }

  salir() { this.auth.logout(); this.router.navigate(['/login']); }
}

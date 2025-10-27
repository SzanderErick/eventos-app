import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventoService } from '../../service/evento.service';
import { TicketPublicadoService } from '../../service/ticket-publicado.service';
import { BoletoService } from '../../service/boleto.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Evento } from '../../models/evento.model';
import { TicketPublicado } from '../../models/ticket-publicado.model';
import { Boleto } from '../../models/boleto.model';

@Component({
  selector: 'app-boletos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boletos.html',
  styleUrls: ['./boletos.css'],
})
export class BoletosComponent {
  private router = inject(Router);
  private eventoSrv = inject(EventoService);
  private pubSrv = inject(TicketPublicadoService);
  private boletoSrv = inject(BoletoService);

  eventos$: Observable<Evento[]> = this.eventoSrv.listar();

  publicados$!: Observable<TicketPublicado[]>;
  eventoId = '';

  msg = '';

  mostrarQR = false;
  qrBoleto: Boleto | null = null;
  qrEventoTitulo = '';
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;

  private titulos = new Map<string, string>();

  async ngOnInit() {
    const evs = await firstValueFrom(this.eventoSrv.listar());
    evs.forEach(e => this.titulos.set(e.id!, e.titulo));
    this.cargarPublicados();
  }

  cargarPublicados() {
    this.publicados$ = this.eventoId
      ? this.pubSrv.listarPorEvento(this.eventoId)
      : this.pubSrv.listar();
  }

  publicar() {
    const params = this.eventoId ? { queryParams: { eventoId: this.eventoId } } : undefined;
    this.router.navigate(['/boletos/publicar'], params);
  }

  editarPublicado(id: string) {
    this.router.navigate(['/boletos/publicar'], { queryParams: { id } });
  }

  async eliminarPublicado(id: string) {
    const ok = confirm('¿Eliminar publicación?');
    if (!ok) return;
    await this.pubSrv.eliminar(id);
    this.cargarPublicados();
  }

  mostrarTitulo(id: string): string {
    const hit = this.titulos.get(id);
    if (hit) return hit;
    this.precargarTitulos();
    return id;
  }

  private async precargarTitulos() {
    const evs = await firstValueFrom(this.eventoSrv.listar());
    evs.forEach(e => this.titulos.set(e.id!, e.titulo));
  }

  async verQR(b: Boleto) {
    const e = await firstValueFrom(this.eventoSrv.obtener(b.eventoId));
    this.qrEventoTitulo = e?.titulo ?? '';
    this.qrBoleto = b;
    this.mostrarQR = true;
    setTimeout(() => this.dibujarQR(b.qrPayload), 0);
  }

  cerrarQR() {
    this.mostrarQR = false;
    this.qrBoleto = null;
    this.qrEventoTitulo = '';
  }

  descargarPNG() {
    if (!this.qrCanvas) return;
    const url = this.qrCanvas.nativeElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `boleto-${this.qrBoleto?.id ?? 'qr'}.png`;
    a.click();
  }

  async marcarUsadoDesdeModal() {
    if (!this.qrBoleto?.id) return;
    const ok = confirm(`¿Usar boleto de "${this.qrBoleto.comprador}" para "${this.qrEventoTitulo}"?`);
    if (!ok) return;
    await this.boletoSrv.marcarUsado(this.qrBoleto.id);
    this.qrBoleto = { ...this.qrBoleto, usado: true };
    this.msg = 'Boleto marcado como usado';
    this.cerrarQR();
  }

  private dibujarQR(texto: string) {
    const canvas = this.qrCanvas?.nativeElement;
    if (!canvas) return;
    const tam = 260;
    canvas.width = tam;
    canvas.height = tam;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let seed = 0;
    for (let i = 0; i < texto.length; i++) seed = (seed * 31 + texto.charCodeAt(i)) >>> 0;

    const celdas = 29;
    const size = Math.floor(tam / celdas);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, tam, tam);
    ctx.fillStyle = '#000';

    const box = (x: number, y: number) => {
      ctx.fillRect(x, y, 7 * size, size);
      ctx.fillRect(x, y + 6 * size, 7 * size, size);
      ctx.fillRect(x, y, size, 7 * size);
      ctx.fillRect(x + 6 * size, y, size, 7 * size);
      ctx.fillRect(x + 2 * size, y + 2 * size, 3 * size, 3 * size);
    };
    box(size, size);
    box(tam - 8 * size, size);
    box(size, tam - 8 * size);

    for (let y = 0; y < celdas; y++) {
      for (let x = 0; x < celdas; x++) {
        const inFinder =
          (x >= 1 && x < 8 && y >= 1 && y < 8) ||
          (x >= celdas - 8 && x < celdas - 1 && y >= 1 && y < 8) ||
          (x >= 1 && x < 8 && y >= celdas - 8 && y < celdas - 1);
        if (inFinder) continue;

        seed = (seed ^ (seed << 13)) >>> 0;
        seed = (seed ^ (seed >>> 17)) >>> 0;
        seed = (seed ^ (seed << 5)) >>> 0;
        if ((seed & 1) === 1) {
          ctx.fillRect(x * size, y * size, size, size);
        }
      }
    }
  }
}

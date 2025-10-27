import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoletoService } from '../../../service/boleto.service';
import { AuthService } from '../../../service/auth.service';
import { EventoService } from '../../../service/evento.service';
import { Observable, firstValueFrom, map } from 'rxjs';
import { Boleto } from '../../../models/boleto.model';

@Component({
  selector: 'app-mis-boletos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-boletos.html',
  styleUrls: ['./mis-boletos.css'],
})
export class MisBoletosComponent {
  private boletoSrv = inject(BoletoService);
  private eventoSrv = inject(EventoService);
  private auth = inject(AuthService);

  boletos$!: Observable<Boleto[]>;
  
  titulos: Record<string, string> = {};

  mostrarQR = false;
  qrBoleto: Boleto | null = null;
  qrEventoTitulo = '';
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
    const user = this.auth.currentUser();
    const comprador = user?.username ?? '';
    
    this.boletos$ = this.boletoSrv.listarPorComprador(comprador).pipe(
      
      map((bs) => {
        this.prepararTitulos(bs);
        return bs;
      })
    );
  }

  private async prepararTitulos(boletos: Boleto[]) {
    const ids = Array.from(new Set(boletos.map(b => b.eventoId).filter(Boolean)));
    for (const id of ids) {
      if (!this.titulos[id]) {
        const ev = await firstValueFrom(this.eventoSrv.obtener(id));
        this.titulos[id] = ev?.titulo ?? id;
      }
    }
  }

  async verQR(b: Boleto) {
    this.qrBoleto = b;
    // usa ya-resuelto si está, o resuelve por si faltara
    this.qrEventoTitulo = this.titulos[b.eventoId] ?? (await firstValueFrom(this.eventoSrv.obtener(b.eventoId)))?.titulo ?? b.eventoId;
    this.mostrarQR = true;
    setTimeout(() => this.dibujarQR(b.qrPayload), 0);
  }

  cerrarQR() {
    this.mostrarQR = false;
    this.qrBoleto = null;
    this.qrEventoTitulo = '';
  }

  async usarDesdeModal() {
    if (!this.qrBoleto?.id) return;
    const ok = confirm(`¿Usar boleto de "${this.qrBoleto.comprador}" para "${this.qrEventoTitulo}"?`);
    if (!ok) return;
    await this.boletoSrv.marcarUsado(this.qrBoleto.id);
    
    const user = this.auth.currentUser();
    const comprador = user?.username ?? '';
    this.boletos$ = this.boletoSrv.listarPorComprador(comprador).pipe(
      map((bs) => {
        this.prepararTitulos(bs);
        return bs;
      })
    );
    this.qrBoleto = { ...this.qrBoleto, usado: true };
    this.cerrarQR();
  }

  descargarPNG() {
    if (!this.qrCanvas) return;
    const url = this.qrCanvas.nativeElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `boleto-${this.qrBoleto?.id ?? 'qr'}.png`;
    a.click();
  }

  
  private dibujarQR(texto: string) {
    const canvas = this.qrCanvas?.nativeElement;
    if (!canvas) return;
    const tam = 260;
    canvas.width = tam; canvas.height = tam;
    const ctx = canvas.getContext('2d'); if (!ctx) return;

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
        if ((seed & 1) === 1) ctx.fillRect(x * size, y * size, size, size);
      }
    }
  }
}

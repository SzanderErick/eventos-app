import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, addDoc, doc, updateDoc, deleteDoc,
  collectionData, query, where, getCountFromServer, getDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Boleto } from '../models/boleto.model';

@Injectable({ providedIn: 'root' })
export class BoletoService {
  private db = inject(Firestore);
  private col = collection(this.db, 'boletos');

  // Listar por evento (admin)
  listarPorEvento(eventoId: string): Observable<Boleto[]> {
    const q = query(this.col, where('eventoId', '==', eventoId));
    return collectionData(q, { idField: 'id' }) as Observable<Boleto[]>;
  }

  // Listar por comprador (cliente: Mis Boletos)
  listarPorComprador(comprador: string): Observable<Boleto[]> {
    const q = query(this.col, where('comprador', '==', comprador));
    return collectionData(q, { idField: 'id' }) as Observable<Boleto[]>;
  }

  // Contador vendidos por evento
  async vendidos(eventoId: string): Promise<number> {
    const q = query(this.col, where('eventoId', '==', eventoId));
    const snap = await getCountFromServer(q);
    return Number(snap.data().count || 0);
  }

  // Capacidad del evento
  private async aforoEvento(eventoId: string): Promise<number> {
    const eRef = doc(this.db, `eventos/${eventoId}`);
    const eSnap = await getDoc(eRef);
    const data = eSnap.exists() ? (eSnap.data() as any) : null;
    return Number(data?.aforoMax || 0);
  }

  // Crear boleto 
  async crear(b: Omit<Boleto, 'id' | 'qrPayload' | 'usado' | 'creadoEn'>) {
    const aforo = await this.aforoEvento(b.eventoId);
    const vendidos = await this.vendidos(b.eventoId);
    if (vendidos >= aforo) throw new Error(`Aforo completo: ${vendidos}/${aforo}`);

    const payload = JSON.stringify({
      eventoId: b.eventoId,
      comprador: b.comprador,
      ts: Date.now()
    });

    await addDoc(this.col, {
      ...b,
      qrPayload: payload,
      usado: false,
      creadoEn: new Date().toISOString(),
    });
  }

  // Marcar usado
  async marcarUsado(id: string) {
    const ref = doc(this.db, `boletos/${id}`);
    await updateDoc(ref, { usado: true });
  }

  // Eliminar 
  async eliminar(id: string) {
    const ref = doc(this.db, `boletos/${id}`);
    const snap = await getDoc(ref);
    const data = snap.exists() ? (snap.data() as any) : null;
    if (data?.usado) throw new Error('No se puede eliminar: el boleto ya fue usado');
    await deleteDoc(ref);
  }
}

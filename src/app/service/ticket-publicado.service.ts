import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, addDoc, doc, updateDoc, deleteDoc,
  collectionData, query, where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TicketPublicado } from '../models/ticket-publicado.model';

@Injectable({ providedIn: 'root' })
export class TicketPublicadoService {
  private db = inject(Firestore);
  private col = collection(this.db, 'boletos_publicados');

  listar(): Observable<TicketPublicado[]> {
    return collectionData(this.col, { idField: 'id' }) as Observable<TicketPublicado[]>;
  }

  listarPorEvento(eventoId: string): Observable<TicketPublicado[]> {
    const q = query(this.col, where('eventoId', '==', eventoId), where('activo', '==', true));
    return collectionData(q, { idField: 'id' }) as Observable<TicketPublicado[]>;
  }

  async crear(p: Omit<TicketPublicado, 'id' | 'creadoEn' | 'activo'>) {
    await addDoc(this.col, { ...p, activo: true, creadoEn: new Date().toISOString() });
  }

  async actualizar(id: string, data: Partial<TicketPublicado>) {
    const ref = doc(this.db, `boletos_publicados/${id}`);
    await updateDoc(ref, data as any);
  }

  async eliminar(id: string) {
    const ref = doc(this.db, `boletos_publicados/${id}`);
    await deleteDoc(ref);
  }
}

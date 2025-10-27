import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, addDoc, doc, updateDoc, deleteDoc,
  collectionData, docData, query, where, orderBy, getDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private db = inject(Firestore);
  private col = collection(this.db, 'eventos');

  listar(): Observable<Evento[]> {
    const q = query(this.col, orderBy('fecha', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Evento[]>;
  }

  listarPublicados(): Observable<Evento[]> {
    const q = query(this.col, where('publicado', '==', true), orderBy('fecha', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Evento[]>;
  }

  obtener(id: string): Observable<Evento> {
    const ref = doc(this.db, `eventos/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Evento>;
  }

  private async capacidadSalon(salonId: string): Promise<number> {
    const sRef = doc(this.db, `salones/${salonId}`);
    const sSnap = await getDoc(sRef);
    const cap = (sSnap.exists() ? (sSnap.data() as any).capacidad : 0) as number;
    return cap || 0;
  }

  async crear(e: Evento) {
    const cap = await this.capacidadSalon(e.salonId);
    if (e.aforoMax > cap) {
      throw new Error(`Aforo máximo (${e.aforoMax}) supera capacidad del salón (${cap}).`);
    }
    await addDoc(this.col, e);
  }

  async actualizar(id: string, e: Partial<Evento>) {
    const ref = doc(this.db, `eventos/${id}`);
    if (e.salonId || e.aforoMax !== undefined) {
      const act = await getDoc(ref);
      const prev = act.data() as any;
      const salonId = (e.salonId ?? prev.salonId) as string;
      const aforo = Number(e.aforoMax ?? prev.aforoMax);
      const cap = await this.capacidadSalon(salonId);
      if (aforo > cap) {
        throw new Error(`Aforo máximo (${aforo}) supera capacidad del salón (${cap}).`);
      }
    }
    await updateDoc(ref, { ...e });
  }

  async eliminar(id: string) {
    const ref = doc(this.db, `eventos/${id}`);
    await deleteDoc(ref);
  }
}

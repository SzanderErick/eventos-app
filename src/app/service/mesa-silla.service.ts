import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, doc, addDoc, updateDoc, deleteDoc,
  collectionData, docData, query, where, getDocs, getDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mesa } from '../models/mesa.model';

@Injectable({ providedIn: 'root' })
export class MesaSillaService {
  private db = inject(Firestore);
  private col = collection(this.db, 'mesas');

  listarPorSalon(salonId: string): Observable<Mesa[]> {
    const q = query(this.col, where('salonId', '==', salonId));
    return collectionData(q, { idField: 'id' }) as Observable<Mesa[]>;
  }

  obtener(id: string): Observable<Mesa> {
    const ref = doc(this.db, `mesas/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Mesa>;
  }

  private async capacidadSalon(salonId: string): Promise<number> {
    const sRef = doc(this.db, `salones/${salonId}`);
    const sSnap = await getDoc(sRef);
    const cap = (sSnap.exists() ? (sSnap.data() as any).capacidad : 0) as number;
    return cap || 0;
  }

  private async totalSillasSalon(salonId: string, excluirMesaId?: string): Promise<number> {
    const qMesas = query(this.col, where('salonId', '==', salonId));
    const snap = await getDocs(qMesas);
    let total = 0;
    snap.forEach(d => {
      if (excluirMesaId && d.id === excluirMesaId) return;
      const data = d.data() as any;
      total += Number(data?.sillas || 0);
    });
    return total;
  }

  async crear(mesa: Mesa) {
    const cap = await this.capacidadSalon(mesa.salonId);
    const total = await this.totalSillasSalon(mesa.salonId);
    if (total + mesa.sillas > cap) {
      throw new Error(`Capacidad excedida: ${total + mesa.sillas}/${cap}`);
    }
    await addDoc(this.col, mesa);
  }

  async actualizar(id: string, mesa: Partial<Mesa>) {
    const ref = doc(this.db, `mesas/${id}`);
    const prevSnap = await getDoc(ref);
    const prev = prevSnap.data() as any;
    const salonId = (mesa.salonId ?? prev.salonId) as string;

    const cap = await this.capacidadSalon(salonId);
    const totalSinActual = await this.totalSillasSalon(salonId, id);
    const nuevasSillas = Number(mesa.sillas ?? prev.sillas);
    if (totalSinActual + nuevasSillas > cap) {
      throw new Error(`Capacidad excedida: ${totalSinActual + nuevasSillas}/${cap}`);
    }
    await updateDoc(ref, { ...mesa });
  }

  async eliminar(id: string) {
    const ref = doc(this.db, `mesas/${id}`);
    await deleteDoc(ref);
  }
}

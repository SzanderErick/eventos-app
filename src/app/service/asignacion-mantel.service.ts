import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, addDoc, doc, updateDoc, deleteDoc,
  collectionData, query, where, getDocs, getDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AsignacionMantel } from '../models/asignacion-mantel.model';

@Injectable({ providedIn: 'root' })
export class AsignacionMantelService {
  private db = inject(Firestore);
  private col = collection(this.db, 'asignacionManteles');

  listarPorSalon(salonId: string): Observable<AsignacionMantel[]> {
    const q = query(this.col, where('salonId', '==', salonId));
    return collectionData(q, { idField: 'id' }) as Observable<AsignacionMantel[]>;
  }

  listarPorSalonYMesa(salonId: string, mesaId: string): Observable<AsignacionMantel[]> {
    const q = query(this.col,
      where('salonId', '==', salonId),
      where('mesaId', '==', mesaId),
    );
    return collectionData(q, { idField: 'id' }) as Observable<AsignacionMantel[]>;
  }

  private async stockTotalMantel(mantelId: string): Promise<number> {
    const ref = doc(this.db, `manteles/${mantelId}`);
    const snap = await getDoc(ref);
    return (snap.exists() ? (snap.data() as any).stockTotal : 0) as number;
  }

  private async totalAsignadoMantel(mantelId: string, excluirId?: string): Promise<number> {
    const qAll = query(this.col, where('mantelId', '==', mantelId));
    const snap = await getDocs(qAll);
    let total = 0;
    snap.forEach(d => {
      if (excluirId && d.id === excluirId) return;
      total += Number((d.data() as any)?.cantidad || 0);
    });
    return total;
  }

  async crear(a: AsignacionMantel) {
    if (!a.mesaId) throw new Error('Falta mesaId');
    const stock = await this.stockTotalMantel(a.mantelId);
    const total = await this.totalAsignadoMantel(a.mantelId);
    if (total + a.cantidad > stock) throw new Error(`Stock insuficiente: ${total + a.cantidad}/${stock}`);
    await addDoc(this.col, a);
  }

  async actualizar(id: string, a: Partial<AsignacionMantel>) {
    const ref = doc(this.db, `asignacionManteles/${id}`);
    const prev = (await getDoc(ref)).data() as any;
    const mantelId = (a.mantelId ?? prev.mantelId) as string;
    const nuevaCant = Number(a.cantidad ?? prev.cantidad);
    const stock = await this.stockTotalMantel(mantelId);
    const totalSinActual = await this.totalAsignadoMantel(mantelId, id);
    if (totalSinActual + nuevaCant > stock) throw new Error(`Stock insuficiente: ${totalSinActual + nuevaCant}/${stock}`);
    await updateDoc(ref, { ...a });
  }

  async eliminar(id: string) {
    await deleteDoc(doc(this.db, `asignacionManteles/${id}`));
  }
}

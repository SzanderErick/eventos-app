import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, addDoc, doc, updateDoc, deleteDoc,
  collectionData, docData, query, orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mantel } from '../models/mantel.model';

@Injectable({ providedIn: 'root' })
export class MantelService {
  private db = inject(Firestore);
  private col = collection(this.db, 'manteles');

  listar(): Observable<Mantel[]> {
    const q = query(this.col, orderBy('nombre'));
    return collectionData(q, { idField: 'id' }) as Observable<Mantel[]>;
  }

  obtener(id: string): Observable<Mantel> {
    const ref = doc(this.db, `manteles/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Mantel>;
  }

  async crear(m: Mantel) { await addDoc(this.col, m); }

  async actualizar(id: string, m: Partial<Mantel>) {
    const ref = doc(this.db, `manteles/${id}`);
    await updateDoc(ref, { ...m });
  }

  async eliminar(id: string) {
    const ref = doc(this.db, `manteles/${id}`);
    await deleteDoc(ref);
  }
}
// src/app/service/salon.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collectionData,
  docData,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Salon } from '../models/salon.model';

@Injectable({ providedIn: 'root' })
export class SalonService {
  private db = inject(Firestore);
  private colRef = collection(this.db, 'salones');

  listar(): Observable<Salon[]> {
    const q = query(this.colRef, orderBy('nombre'));
    return collectionData(q, { idField: 'id' }) as Observable<Salon[]>;
  }

  obtener(id: string): Observable<Salon> {
    const ref = doc(this.db, `salones/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Salon>;
  }

  async crear(data: Salon) {
    await addDoc(this.colRef, data);
  }

  async actualizar(id: string, data: Partial<Salon>) {
    const ref = doc(this.db, `salones/${id}`);
    await updateDoc(ref, { ...data });
  }

  async eliminar(id: string) {
    const ref = doc(this.db, `salones/${id}`);
    await deleteDoc(ref);
  }
}

import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';

export interface NewUserPayload {
  username: string;
  password: string;
  rol: 'agente' | 'cliente';
}

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  private db = inject(Firestore);
  // Asegura que esta colección exista; tu login busca primero 'usuarios' y luego 'users'.
  private col = collection(this.db, 'usuarios');

  async existeUsuario(username: string): Promise<boolean> {
    const q = query(this.col, where('username', '==', username.trim()));
    const snap = await getDocs(q);
    return !snap.empty;
  }

  async crearUsuario(data: NewUserPayload) {
    const username = data.username.trim();
    const password = data.password.trim();
    if (!username || !password) throw new Error('Usuario y contraseña son obligatorios');
    if (await this.existeUsuario(username)) throw new Error('El usuario ya existe');

    await addDoc(this.col, {
      username,
      password,
      rol: data.rol,
      creadoEn: new Date().toISOString(),
    });
  }
}

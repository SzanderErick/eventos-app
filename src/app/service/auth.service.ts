import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private db = inject(Firestore);

  async login(username: string, password: string) {
    const usersCol = collection(this.db, 'users');
    const q = query(
      usersCol,
      where('username', '==', username),
      where('password', '==', password)
    );
    const snap = await getDocs(q);
    if (snap.empty) throw new Error('Usuario o contraseña inválidos');

    const doc = snap.docs[0];
    const data = doc.data() as any;
    const user = {
      id: doc.id,
      username: data?.username ?? username,
      role: data?.role ?? 'agente',
      ...data
    };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  logout() { localStorage.removeItem('user'); }
  currentUser() {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }
}

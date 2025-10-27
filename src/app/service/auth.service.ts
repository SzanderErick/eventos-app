import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

type RolValido = 'agente' | 'cliente';
export interface UserSession { id: string; username: string; rol: RolValido; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private db = inject(Firestore);
  private user$ = new BehaviorSubject<UserSession | null>(this.leerLocal());

  private leerLocal(): UserSession | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) as UserSession : null;
  }
  private escribirLocal(user: UserSession | null) {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    this.user$.next(user);
  }

  currentUser() {
    const mem = this.user$.value;
    if (mem) return mem;
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as UserSession) : null;
  }
  userChanges() { return this.user$.asObservable(); }

  private async buscarDoc(nombreCol: string, username: string, password: string) {
    const col = collection(this.db, nombreCol);
    const q = query(
      col,
      where('username', '==', username.trim()),
      where('password', '==', password.trim())
    );
    const snap = await getDocs(q);
    return snap.empty ? null : snap.docs[0];
  }

  private normalizarRol(data: any): RolValido {
    const raw = (data?.rol ?? data?.role ?? data?.Role ?? data?.Rol ?? '').toString().toLowerCase().trim();
    if (['agente','admin','administrador'].includes(raw)) return 'agente';
    if (['cliente','user','usuario'].includes(raw)) return 'cliente';
    return 'cliente';
  }

  async login(username: string, password: string) {
    let docSnap = await this.buscarDoc('usuarios', username, password);
    if (!docSnap) docSnap = await this.buscarDoc('users', username, password);
    if (!docSnap) throw new Error('Usuario o contraseña inválidos');

    const data = docSnap.data() as any;
    const user: UserSession = {
      id: docSnap.id,
      username: (data?.username ?? username).toString(),
      rol: this.normalizarRol(data),
    };
    console.log('Auth login:', { id: docSnap.id, data, user });
    this.escribirLocal(user);
    return user;
  }

  logout() { this.escribirLocal(null); }
}

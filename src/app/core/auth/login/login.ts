import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { UserAdminService } from '../../../service/user-admin.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private userAdmin = inject(UserAdminService);

  username = '';
  password = '';
  error = '';
  loading = false;

  showRegister = false;
  reg = { username: '', password: '', rol: 'cliente' as 'agente' | 'cliente' };
  regError = '';
  regOk = '';

  get hayAgenteLogueado() {
    
    const u = this.auth.currentUser();
    return u?.rol === 'agente';
  }

  async onSubmit() {
    this.error = '';
    this.loading = true;
    try {
      await this.auth.login(this.username, this.password);
      this.router.navigate(['/home']);
    } catch (e: any) {
      this.error = e?.message ?? 'Error de acceso';
    } finally {
      this.loading = false;
    }
  }

  abrirRegistro() {
    this.reg = { username: '', password: '', rol: 'cliente' };
    this.regError = ''; this.regOk = '';
    this.showRegister = true;
  }
  cerrarRegistro() {
    this.showRegister = false;
  }

  async registrar() {
    this.regError = ''; this.regOk = '';
    try {
      if (!this.reg.username.trim() || !this.reg.password.trim()) {
        throw new Error('Usuario y contraseña son obligatorios');
      }
      
      if (!this.hayAgenteLogueado) this.reg.rol = 'cliente';
      await this.userAdmin.crearUsuario(this.reg);
      this.regOk = 'Cuenta creada. Ya puedes iniciar sesión.';
      
      this.username = this.reg.username;
      this.password = this.reg.password;
    } catch (e: any) {
      this.regError = e?.message ?? 'No se pudo crear la cuenta';
    }
  }
}


import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAdminService } from '../../service/user-admin.service';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-usuario.html',
  styleUrls: ['./form-usuario.css'],
})
export class FormUsuarioComponent {
  private srv = inject(UserAdminService);
  private router = inject(Router);

  model: { username: string; password: string; rol: 'agente' | 'cliente' } = {
    username: '',
    password: '',
    rol: 'cliente',
  };
  error = '';
  msg = '';

  async guardar() {
    this.error = ''; this.msg = '';
    try {
      await this.srv.crearUsuario(this.model);
      this.msg = 'Usuario creado correctamente';
      this.model = { username: '', password: '', rol: 'cliente' };
    } catch (e: any) {
      this.error = e?.message ?? 'No se pudo crear el usuario';
    }
  }

  volver() { this.router.navigate(['/home']); }
}

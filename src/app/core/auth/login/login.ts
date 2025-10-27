// src/app/core/auth/login/login.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

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

  username = '';
  password = '';
  error = '';
  loading = false;

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
}

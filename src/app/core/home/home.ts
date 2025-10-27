import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
})
export class HomeComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  user = this.auth.currentUser();

  salir() { this.auth.logout(); this.router.navigate(['/login']); }
}

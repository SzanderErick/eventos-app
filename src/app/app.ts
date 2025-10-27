import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService, UserSession } from './service/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, AsyncPipe],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  private auth = inject(AuthService);
  user$: Observable<UserSession | null> = this.auth.userChanges();
  logout() { this.auth.logout(); }
}

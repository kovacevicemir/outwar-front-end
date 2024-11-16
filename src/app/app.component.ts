import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { AppRoutingModule } from './app.routes';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppRoutingModule, TooltipModule, CommonModule, ProfilePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { EquipedItemsModule } from './equiped-items/equiped-items.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TooltipModule, CommonModule, EquipedItemsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  
}

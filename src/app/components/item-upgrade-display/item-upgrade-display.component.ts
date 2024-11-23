import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-item-upgrade-display',
  templateUrl: './item-upgrade-display.component.html',
  styleUrls: ['./item-upgrade-display.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class ItemUpgradeDisplayComponent {
  @Input() upgradeLevel: number | undefined = 0; // Default to 0 if no input is provided

  // Method to return the correct images based on upgradeLevel
  getImages(): string[] {
    switch (this.upgradeLevel) {
      case 1:
        return ['../../../assets/greengem.gif'];
      case 2:
        return ['../../../assets/greengem.gif', '../../../assets/bluegem.gif'];
      case 3:
        return ['../../../assets/greengem.gif', '../../../assets/bluegem.gif', '../../../assets/redgem.gif'];
      default:
        return []; // No images for other upgrade levels
    }
  }
}

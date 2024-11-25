import { Component, effect, OnInit } from '@angular/core';
import {
  Item,
  PlayerProfileServiceService,
} from '../../services/PlayerProfileService.service';
import { ItemUpgradeDisplayComponent } from '../../components/item-upgrade-display/item-upgrade-display.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blacksmith-page',
  templateUrl: './blacksmith-page.component.html',
  styleUrls: ['./blacksmith-page.component.css'],
  imports: [CommonModule, ItemUpgradeDisplayComponent],
  standalone: true,
})
export class BlacksmithPageComponent implements OnInit {
  inventoryItems = this.playerProfileService.inventoryItemsSignal.asReadonly();
  activeItem = 0;
  selectedItem: Item | undefined = undefined;

  constructor(private playerProfileService: PlayerProfileServiceService) {
    effect(() => {
      this.inventoryItems(); //track inventory signal change
      this.activeItem = 0;
    });
  }

  ngOnInit() {}

  upgrade() {
    alert('todo');
  }

  getUpgradeCostText() {
    if (this.selectedItem) {
      switch (this.selectedItem.upgradeLevel) {
        case 0:
          return 'Upgrade will cost you 20 points';
        case 1:
          return 'Upgrade will cost you 30 points';
        case 2:
          return 'Upgrade will cost you 50 points';
        default:
          return '';
      }
    }
    return '';
  }

  setActiveItem(item: number) {
    if (this.activeItem === item) {
      this.activeItem = 0;
    } else {
      this.activeItem = item;
    }
  }

  selectItem(item: Item) {
    this.selectedItem = item;
    this.activeItem = 0;
  }
}

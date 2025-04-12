import { ChangeDetectionStrategy, Component, effect } from '@angular/core';
import { Item, PlayerProfileServiceService } from '../../services/PlayerProfileService.service';
import { CommonModule } from '@angular/common';
import { ItemUpgradeDisplayComponent } from '../item-upgrade-display/item-upgrade-display.component';
import { MatIcon } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  imports: [CommonModule, ItemUpgradeDisplayComponent, MatIcon],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryComponent {
  inventoryItems = this.playerProfileService.inventoryItemsSignal.asReadonly();
  activeItem = 0;

  constructor(private http: HttpClient, private playerProfileService: PlayerProfileServiceService) {
   
    effect(() => {
      this.inventoryItems(); //track inventory signal change
      this.activeItem = 0;
    });
  }

  setActiveItem(item: number) {
    if (this.activeItem === item) {
      this.activeItem = 0;
    } else {
      this.activeItem = item;
    }
  }

  equipItem(item: Item){
    this.playerProfileService.equipItem(item);
  }

  deleteItem(item: Item){
    this.playerProfileService.deleteItem(item);
  }

  async toggleLockItem(itemId: number){
    const url = `${environment.baseUrl}/lock-item-toggle?itemId=${itemId}`;
      try {
        const response = await this.http.post(url,null).toPromise();
        if(response){
          this.playerProfileService.getUserByUsername();
        }
      } catch (error) {
        console.error('Error getting  active skills:', error);
        throw error;
      }
  }
}

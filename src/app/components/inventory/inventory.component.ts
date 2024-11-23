import { ChangeDetectionStrategy, Component, effect, OnInit } from '@angular/core';
import { Item, PlayerProfileServiceService } from '../../services/PlayerProfileService.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryComponent implements OnInit {
  inventoryItems = this.playerProfileService.inventoryItemsSignal.asReadonly();
  activeItem = 0;

  constructor(private playerProfileService: PlayerProfileServiceService) {
   
    effect(() => {
      this.inventoryItems(); //track inventory signal change
      this.activeItem = 0;
    });
  }

  ngOnInit() {
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
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Item, PlayerProfileServiceService } from '../../services/PlayerProfileService.service';
import { CommonModule } from '@angular/common';
import { ItemUpgradeDisplayComponent } from '../item-upgrade-display/item-upgrade-display.component';

@Component({
  selector: 'app-equiped-items-redo',
  templateUrl: './equiped-items-redo.component.html',
  styleUrls: ['./equiped-items-redo.component.css'],
  standalone: true,
  imports: [CommonModule, ItemUpgradeDisplayComponent]
})
export class EquipedItemsRedoComponent implements OnInit {

  title = 'micro-outwar';
  activeItem = '';
  equipedItems = this.playerProfileService.equipedItems.asReadonly();

  constructor(private playerProfileService: PlayerProfileServiceService) {}

  debug(){
    console.log("this.playerProfileService.equipedItems.asReadonly(); ", this.playerProfileService.equipedItems.asReadonly()())
  }

  ngOnInit() {
    this.playerProfileService.getUserByUsername('test1');
  }

  resolveImagePath(item: Item | undefined){
    return this.playerProfileService.resolveImagePath(item);
  }

  unequipItem(item?: Item){
    if(item){
      this.playerProfileService.unequipItem(item);
      this.setActiveItem(item.type)
    }
  }

  setActiveItem(item: string) {
    if (this.activeItem === item) {
      this.activeItem = '';
    } else {
      this.activeItem = item;
    }
  }

}

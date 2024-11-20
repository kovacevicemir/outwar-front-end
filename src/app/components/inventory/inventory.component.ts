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

  constructor(private playerProfileService: PlayerProfileServiceService, private http: HttpClient) {}

  ngOnInit() {
  }

  setActiveItem(item: number) {
    console.log("setting active item: ",item)

    if (this.activeItem === item) {
      this.activeItem = 0;
    } else {
      this.activeItem = item;
    }
  }

  equipItem(item: Item){
    this.playerProfileService.equipItem(item);
  }

  resolveImagePath(item: Item | undefined){
    if(item === undefined){
      return "resolve image path went wrong! - replace with default img 2"
    }

    if(item.name.includes("Champions")){
      return `../assets/championset/champ${item.type}.gif`
    }

    if(item.name === "Scimitar of Flame"){
      return "../assets/quiver/quiweapon.gif"
    }

    return "resolve image path went wrong! - replace with default img"
  }
}

import { Component, OnInit } from '@angular/core';
import { EquipedItems, Item, PlayerProfileServiceService } from '../../services/PlayerProfileService.service';


@Component({
  selector: 'app-equiped-items',
  templateUrl: './equiped-items.component.html',
  styleUrls: ['./equiped-items.component.css'],
})
export class EquipedItemsComponent implements OnInit {
  constructor(private playerProfileService: PlayerProfileServiceService) {}

  ngOnInit() {
    this.playerProfileService.getUserByUsername('test1');
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

  title = 'micro-outwar';
  activeItem = '';
  equipedItems: EquipedItems = this.playerProfileService.equipedItems;

  setActiveItem(item: string) {
    if (this.activeItem === item) {
      this.activeItem = '';
    } else {
      this.activeItem = item;
    }
  }
}

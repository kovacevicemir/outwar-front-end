import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Item, PlayerProfileServiceService } from '../../services/PlayerProfileService.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-equiped-items-redo',
  templateUrl: './equiped-items-redo.component.html',
  styleUrls: ['./equiped-items-redo.component.css'],
  standalone: true,
  imports: [CommonModule]
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

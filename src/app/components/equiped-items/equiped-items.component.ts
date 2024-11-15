import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-equiped-items',
  templateUrl: './equiped-items.component.html',
  styleUrls: ['./equiped-items.component.css'],
})
export class EquipedItemsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  title = 'micro-outwar';
  activeItem = '';
  equipedItems = {
    head: {
      name: 'Head-Gear of Champions',
      hp: 150,
      rage: 20,
      exp: 20,
      rampage: 4,
    },
    neck: {
      name: 'Sweaty Towel of Champions',
      hp: 150,
      rage: 35,
      exp: 10,
      critical: 5,
    },
    weapon: {
      name: 'Precision Glove of Champions',
      atk: 85,
      rage: 32,
      exp: 15,
      maxRage: 500,
      critical: 4,
    },
    armor: {
      name: 'Silken Shroud of Champions',
      hp: 155,
      rage: 23,
      exp: 17,
      maxRage: 500,
      critical: 5,
    },
    shield: {
      name: 'Power Glove of Champions',
      hp: 150,
      rage: 15,
      exp: 23,
      maxRage: 400,
      block: 7,
      critical: 4,
    },
    belt: {
      name: 'Title Belt of Champions',
      hp: 150,
      exp: 25,
      rampage: 5,
      critical: 5,
    },
    shoes: {
      name: 'Sneakers of Champions',
      hp: 150,
      rage: 15,
      exp: 25,
      rampage: 4,
      critical: 5,
    },
    ring: { name: 'Medical Tape of Champions', rage: 22, exp: 22, critical: 4 },
  };

  setActiveItem(item: string) {
    if (this.activeItem === item) {
      this.activeItem = '';
    } else {
      this.activeItem = item;
    }
  }

}

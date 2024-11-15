import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

type Item = {
  id: number;
  name: string;
  stats: number[]; // Array of numbers for stats
  setBonus: number[]; // Array of numbers for set bonuses
  upgradeLevel: number;
  type: string;
  attack?: number;
  hp?: number;
  maxRage?: number;
  rage?: number;
  exp?: number;
  rampage?: number;
  critical?: number;
  block?: number;
  urlPath?: string
};

type EquipedItems = {
  head?: Item;
  neck?: Item;
  weapon?: Item;
  armor?: Item;
  shield?: Item;
  belt?: Item;
  shoes?: Item;
  ring?: Item;
};

type UserResponse = {
  id: number;
  name: string;
  level: number;
  experience: number;
  items: {
      id: number;
      name: string;
      stats: number[];
      setBonus: number[];
      upgradeLevel: number;
      type: string;
  }[];
  equipedItemsId: number[];
  questMonsterIds: number[];
}

@Component({
  selector: 'app-equiped-items',
  templateUrl: './equiped-items.component.html',
  styleUrls: ['./equiped-items.component.css'],
})
export class EquipedItemsComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUserByUsername('test1');
  }

  getUserByUsername(username: string) {
    const url = `https://localhost:44338/get-user-by-username?username=${username}`;
    this.http.get(url).subscribe({
      next: (response) => {
        console.log('User data:', response);
        this.generateEquipedItems(response as UserResponse)
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }

  

  generateEquipedItems(user: UserResponse) {
    //Compare equipedItems to Items and find which items that player owns are actually equiped
    const findEquipedItems = user.items.filter(item =>
      user.equipedItemsId.includes(item.id)
    );

    //   0   | 1 |   2   |  3 | 4 |   5   |    6   |  7  
    // attack|hp |maxRage|rage|exp|rampage|critical|block
    // Normalize stats - Translate stats array to real stats - normalize
    // Attach image url to item as well

    const normalizedEquipedItems: Item[] = [];

    findEquipedItems.forEach(item => {
      const normalizedItem = {
        ...item, 
        attack: item.stats[0],
        hp: item.stats[1],
        maxRage: item.stats[2],
        rage: item.stats[3],
        exp: item.stats[4],
        rampage: item.stats[5],
        critical: item.stats[6],
        block: item.stats[7],
        urlPath: this.resolveImagePath(item)
      }

      normalizedEquipedItems.push(normalizedItem);
    })

    //Equip normalized items
    normalizedEquipedItems.forEach(item =>{
      this.equipedItems[item.type as keyof typeof this.equipedItems] = item;
    })
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
  equipedItems: EquipedItems = {};

  setActiveItem(item: string) {
    if (this.activeItem === item) {
      this.activeItem = '';
    } else {
      this.activeItem = item;
    }
  }
}

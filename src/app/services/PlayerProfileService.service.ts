import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal, WritableSignal } from '@angular/core';

export type Item = {
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
  urlPath?: string;
};

export type EquipedItems = {
  head?: Item;
  neck?: Item;
  weapon?: Item;
  armor?: Item;
  shield?: Item;
  belt?: Item;
  shoes?: Item;
  ring?: Item;
};

export type UserResponse = {
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
};

export type PlayerStatsSummary = {
    attack: number,
    hp: number,
    maxRage: number,
    rage: number,
    exp: number,
    rampage: number,
    critical: number,
    block: number,
    totalSetAttackBonus: number,
    totalSetHpBonus: number
}

@Injectable({
  providedIn: 'root',
})
export class PlayerProfileServiceService {
  // Signal to hold the user state
  private userSignal = signal<UserResponse | null>(null);
  public inventoryItemsSignal: WritableSignal<Item[]> = signal<Item[]>([]);
  public equipedItems: WritableSignal<EquipedItems> = signal<EquipedItems>({});
  public playerStatsSummary: WritableSignal<PlayerStatsSummary> = signal<PlayerStatsSummary>({
    attack: 0,
    hp: 0,
    maxRage: 0,
    rage: 0,
    exp: 0,
    rampage: 0,
    critical: 0,
    block: 0,
    totalSetAttackBonus: 0,
    totalSetHpBonus: 0
  });

  constructor(private http: HttpClient) {
    //     // Effect: Trigger functions when userSignal changes

    effect(
      () => {
        const user = this.userSignal(); // Automatically tracks `userSignal`
        if (user !== null) {
          this.generateEquipedItems(user);
          this.generateInventoryItems();
          this.summarizeEquippedItems();
        }
      },
      { allowSignalWrites: true }
    );
  }

  equipItem(item: Item) {
    const url = `https://localhost:44338/equip-item?username=test1&itemId=${item.id}`;
    this.http.post(url, null).subscribe({
      next: (response) => {
        //Refetch - retrigger all?
        this.getUserByUsername('test1');
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }

  unequipItem(item: Item) {
    const url = `https://localhost:44338/unequip-item?username=test1&itemId=${item.id}`;
    this.http.post(url, null).subscribe({
      next: (response) => {
        //Refetch - retrigger all?
        this.getUserByUsername('test1');
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }

  getUserByUsername(username: string) {
    const url = `https://localhost:44338/get-user-by-username?username=${username}`;
    this.http.get(url).subscribe({
      next: (response) => {
        console.log('User data:', response);
        this.userSignal.set(response as UserResponse);
        // this.generateEquipedItems(response as UserResponse);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }

  generateEquipedItems(user: UserResponse) {
    //Compare equipedItems to Items and find which items that player owns are actually equiped
    const findEquipedItems = user.items.filter((item) =>
      user.equipedItemsId.includes(item.id)
    );

    //   0   | 1 |   2   |  3 | 4 |   5   |    6   |  7
    // attack|hp |maxRage|rage|exp|rampage|critical|block
    // Normalize stats - Translate stats array to real stats - normalize
    // Attach image url to item as well

    const newEquipedItems: EquipedItems = {}

    findEquipedItems.forEach((item) => {
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
        urlPath: this.resolveImagePath(item),
      };

       newEquipedItems[normalizedItem.type as keyof typeof newEquipedItems] = item;
    });


    this.equipedItems.set(newEquipedItems);
  }

  summarizeEquippedItems = () => {
    const equippedItems = this.equipedItems();

    const summary = {
      attack: 0,
      hp: 0,
      maxRage: 0,
      rage: 0,
      exp: 0,
      rampage: 0,
      critical: 0,
      block: 0,
      totalSetAttackBonus: 0,
      totalSetHpBonus: 0,
    };

    //   0   | 1 |   2   |  3 | 4 |   5   |    6   |  7  
    // attack|hp |maxRage|rage|exp|rampage|critical|block
  
    Object.values(equippedItems).forEach((item) => {
      if (item) {
        summary.attack += item.stats[0] || 0;
        summary.hp += item.stats[1] || 0;
        summary.maxRage += item.stats[2] || 0;
        summary.rage += item.stats[3] || 0;
        summary.exp += item.stats[4] || 0;
        summary.rampage += item.stats[5] || 0;
        summary.critical += item.stats[6] || 0;
        summary.block += item.stats[7] || 0;
      }
    });
  

    const setBonuses = this.getDistinctSetsWithCalculatedBonus(this.equipedItems(), 8)
    const totalBonuses = this.calculateTotalBonuses(setBonuses);

    summary.attack += totalBonuses.totalAttackBonus
    summary.hp += totalBonuses.totalHpBonus
    summary.totalSetAttackBonus += totalBonuses.totalAttackBonus;
    summary.totalSetHpBonus += totalBonuses.totalHpBonus

    this.playerStatsSummary.set(summary);

  };

  calculateTotalBonuses(
    distinctSets: { numberOfParts: number; setBonus: number[]; calculatedSetBonus: number[] }[]
  ): { totalAttackBonus: number; totalHpBonus: number } {
    let totalAttackBonus = 0;
    let totalHpBonus = 0;
  
    distinctSets.forEach((set) => {
      if (set.calculatedSetBonus.length > 0) {
        totalAttackBonus += set.calculatedSetBonus[0]; // Assuming attack bonus is at index 0
      }
      if (set.calculatedSetBonus.length > 1) {
        totalHpBonus += set.calculatedSetBonus[1]; // Assuming HP bonus is at index 1
      }
    });
  
    return { totalAttackBonus, totalHpBonus };
  }

  getDistinctSetsWithCalculatedBonus(
    equippedItems: EquipedItems,
    maxParts: number
  ): { numberOfParts: number; setBonus: number[]; calculatedSetBonus: number[] }[] {
    const bonusCounts: Record<string, { setBonus: number[]; numberOfParts: number }> = {};
  
    // Count the number of parts for each setBonus
    Object.values(equippedItems).forEach((item) => {
      if (item && item.setBonus) {
        const bonusKey = item.setBonus.join(","); // Use stringified key to represent setBonus
        if (bonusCounts[bonusKey]) {
          bonusCounts[bonusKey].numberOfParts += 1;
        } else {
          bonusCounts[bonusKey] = { setBonus: item.setBonus, numberOfParts: 1 };
        }
      }
    });
  
    // Calculate calculatedSetBonus and round to integers
    return Object.values(bonusCounts).map(({ setBonus, numberOfParts }) => {
      const calculatedSetBonus = setBonus.map((bonus) =>
        Math.round((numberOfParts / maxParts) * bonus)
      );
      return { numberOfParts, setBonus, calculatedSetBonus };
    });
  }

  extractSetName(itemName: string): string | null {
    // Define your set name matching logic here
    const knownSets = ["champion", "banana", "hero", "legend"];
    for (const setName of knownSets) {
      if (itemName.toLowerCase().includes(setName)) {
        return setName;
      }
    }
    return null; // Return null if no set match is found
  }

  resolveImagePath(item: Item | undefined) {
    if (item === undefined) {
      return 'resolve image path went wrong! - replace with default img 2';
    }

    if (item.name.includes('Champions')) {
      return `../assets/championset/champ${item.type}.gif`;
    }

    if (item.name === 'Scimitar of Flame') {
      return '../assets/quiver/quiweapon.gif';
    }

    return 'resolve image path went wrong! - replace with default img';
  }

  generateInventoryItems() {
    const user = this.userSignal();

    if (user !== null) {
      const normalizedItems: Item[] = user.items.map((item) => ({
        ...item,
        attack: item.stats[0],
        hp: item.stats[1],
        maxRage: item.stats[2],
        rage: item.stats[3],
        exp: item.stats[4],
        rampage: item.stats[5],
        critical: item.stats[6],
        block: item.stats[7],
        urlPath: this.resolveImagePath(item),
      }));

      // Filter out already equipped items
      const inventoryItems = normalizedItems.filter(
        (item) => !user.equipedItemsId.includes(item.id)
      );

      // Update the signal
      try {
        this.inventoryItemsSignal.set(inventoryItems);
      } catch (error) {
        console.log(error);
      }

      console.log('final value of signal', this.inventoryItemsSignal());
    }
  }

  getInventoryItemsSignal() {
    return this.inventoryItemsSignal;
  }

  title = 'micro-outwar';
  activeItem = '';
}

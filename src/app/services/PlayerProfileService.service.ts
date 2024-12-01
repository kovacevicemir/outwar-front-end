import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import experienceList from '../data/experienceList.json';

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
  rage: number;
  ragePerHour: number;
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
  crewName?:string
};

export type PlayerStatsSummary = {
  attack: number;
  hp: number;
  maxRage: number;
  rage: number;
  exp: number;
  rampage: number;
  critical: number;
  block: number;
  totalSetAttackBonus: number;
  totalSetHpBonus: number;
  levelAttackBonus: number;
  levelHpBonus: number;
};

@Injectable({
  providedIn: 'root',
})
export class PlayerProfileServiceService {
  // Signal to hold the user state
  public userSignal = signal<UserResponse | null>(null);
  public inventoryItemsSignal: WritableSignal<Item[]> = signal<Item[]>([]);
  public equipedItems: WritableSignal<EquipedItems> = signal<EquipedItems>({});
  public playerStatsSummary: WritableSignal<PlayerStatsSummary> =
    signal<PlayerStatsSummary>({
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
      levelAttackBonus: 0,
      levelHpBonus: 0,
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

  async startQuest(questName: string): Promise<any>{
    const url = `https://localhost:44338/start-quest?username=test1&questName=${questName}`;
    try {
      const response = await this.http.post(url, null).toPromise();
      return response;
    } catch (error) {
      console.error('Error starting quest:', error);
      throw error;
    }
  }

  async upgradeItem(item: Item): Promise<any> {
    const url = `https://localhost:44338/upgrade-item-level-by-item-id?username=test1&itemId=${item.id}`;
    try {
      const response = await this.http.post(url, null).toPromise();
      return response;
    } catch (error) {
      console.error('Error upgrading item:', error);
      throw error;
    }
  }

  equipItem(item: Item) {
    const url = `https://localhost:44338/equip-item?username=test1&itemId=${item.id}`;
    this.http.post(url, null).subscribe({
      next: (response) => {
        //Refetch - retrigger all?
        this.getUserByUsername('test1');
      },
      error: (error) => {
        console.error('Error equiping item:', error);
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
        console.error('Error unequiping item:', error);
      },
    });
  }

  deleteItem(item: Item) {
    const url = `https://localhost:44338/delete-item-from-user-by-item-id?username=test1&itemId=${item.id}`;
    this.http.post(url, null).subscribe({
      next: (response) => {
        //Refetch - retrigger all?
        this.getUserByUsername('test1');
      },
      error: (error) => {
        console.error('Error equiping item:', error);
      },
    });
  }

  getUserByUsername(username: string) {
    const url = `https://localhost:44338/get-user-by-username?username=${username}`;
    this.http.get(url).subscribe({
      next: (response) => {
        this.userSignal.set(response as UserResponse);
      },
      error: (error) => {
        console.error('Error getting user:', error);
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

    const newEquipedItems: EquipedItems = {};

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

      newEquipedItems[normalizedItem.type as keyof typeof newEquipedItems] =
      normalizedItem;
    });

    this.equipedItems.set(newEquipedItems);
  }

  summarizeEquippedItems = () => {
    const equippedItems = this.equipedItems();

    const summary = {
      attack: 10,
      hp: 50,
      maxRage: 2000,
      rage: 10,
      exp: 0,
      rampage: 0,
      critical: 0,
      block: 0,
      totalSetAttackBonus: 0,
      totalSetHpBonus: 0,
      levelAttackBonus: 0,
      levelHpBonus: 0,
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

    const setBonuses = this.getDistinctSetsWithCalculatedBonus(
      this.equipedItems(),
      8
    );
    const totalBonuses = this.calculateTotalBonuses(setBonuses);

    summary.attack += totalBonuses.totalAttackBonus;
    summary.hp += totalBonuses.totalHpBonus;
    summary.totalSetAttackBonus += totalBonuses.totalAttackBonus;
    summary.totalSetHpBonus += totalBonuses.totalHpBonus;

    //Add level bonuses
    const levelDefinition = experienceList.find(
      (e) => e.level === this.userSignal()?.level
    );
    if (levelDefinition) {
      summary.attack += levelDefinition.attackPoints;
      summary.hp += levelDefinition.Hp;
      summary.levelAttackBonus = levelDefinition.attackPoints;
      summary.levelHpBonus = levelDefinition.Hp;
    }

    this.playerStatsSummary.set(summary);
  };

  calculateTotalBonuses(
    distinctSets: {
      numberOfParts: number;
      setBonus: number[];
      calculatedSetBonus: number[];
    }[]
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
  ): {
    numberOfParts: number;
    setBonus: number[];
    calculatedSetBonus: number[];
  }[] {
    const bonusCounts: Record<
      string,
      { setBonus: number[]; numberOfParts: number }
    > = {};

    // Count the number of parts for each setBonus
    Object.values(equippedItems).forEach((item) => {
      if (item && item.setBonus) {
        const bonusKey = item.setBonus.join(','); // Use stringified key to represent setBonus
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
    const knownSets = ['champion', 'banana', 'hero', 'legend'];
    for (const setName of knownSets) {
      if (itemName.toLowerCase().includes(setName)) {
        return setName;
      }
    }
    return null; // Return null if no set match is found
  }

  resolveImagePath(item: Item | undefined){
    if(item === undefined){
      return "resolve image path went wrong! - replace with default img 2"
    }

    if(item.name.includes("Osteology")){
      return `../assets/osteologyset/osteology${item.type}.gif`
    }

    if(item.name.includes("Champions")){
      return `../assets/championset/champ${item.type}.gif`
    }

    if(item.name.includes("Pimp")){
      return `../assets/pimpset/pimp${item.type}.gif`
    }

    if(item.name.includes("Construction")){
      return `../assets/constructionset/con${item.type}.gif`
    }

    if(item.name.includes("Roman")){
      return `../assets/romanset/roman${item.type}.gif`
    }

    if(item.name.includes("Dissimulation")){
      return `../assets/disimulationset/dis${item.type}.gif`
    }

    if(item.name.includes("Cobalt")){
      return `../assets/cobaltset/cob${item.type}.gif`
    }

    if(item.name.includes("Extremity")){
      return `../assets/extremityset/ex${item.type}.gif`
    }

    if(item.name.includes("Symphony")){
      return `../assets/symphonyset/sym${item.type}.gif`
    }

    if(item.name.includes("Octave")){
      return `../assets/octaveset/oct${item.type}.gif`
    }


    if(item.name.includes("Gangland")){
      return `../assets/ganglandset/gan${item.type}.gif`
    }

    if(item.name.includes("Government")){
      return `../assets/govermentset/gov${item.type}.gif`
    }

    if(item.name.includes("Elements")){
      return `../assets/elementalset/ele${item.type}.gif`
    }

    if(item.name.includes("Decay")){
      return `../assets/decayset/dec${item.type}.gif`
    }

    if(item.name.includes("Noc")){
      return `../assets/nocset/noc${item.type}.gif`
    }

    if(item.name === "Scimitar of Flame"){
      return "../assets/quiver/quiweapon.gif"
    }

    switch(item.name) {
      case "Boots of Invulnerability":
          return "../assets/synge/synboots.gif";
      case "Ring of Splendid Wealth":
          return "../assets/synge/synring.gif";
      case "Circlet of Power":
          return "../assets/synge/synhead.gif";
      case "Charred Band":
          return "../assets/synge/synbelt.gif";
      case "Shield of Righteousness":
          return "../assets/synge/synshield.gif";
      case "Plate of the Crimson Sky":
          return "../assets/synge/synbody.gif";
      case "Wrath of the Gods":
          return "../assets/synge/synweapon.gif";
      case "Blood-Soaked Moccasins":
          return "../assets/rancid/ranshoes.gif";
      case "Ring of Hatred":
          return "../assets/rancid/ranring.gif";
      case "Blade of Dark Power":
          return "../assets/rancid/ranweapon.gif";
      case "Ring of the Cunning":
          return "../assets/terrance/terring.gif";
      case "Manacle of Clairvoyent Thought":
          return "../assets/terrance/terhead.gif";
      case "Blade of Disruption":
          return "../assets/terrance/terweapon.gif";
      case "Mask of Confusion":
          return "../assets/terrance/terhead2.gif";
      case "Longsword of War":
          return "../assets/zertan/zerweapon.gif";
      case "Draconic Shield of Terror":
          return "../assets/zertan/zershield.gif";
      case "Plate Mail of Discordance":
          return "../assets/zertan/zerbody.gif";
      case "Boots of Strategy":
          return "../assets/quiver/quishoes.gif";
      case "Ring of Eternal Power":
          return "../assets/quiver/quiring.gif";
      case "Crown of the Cerebral":
          return "../assets/quiver/quihead.gif";
      case "Breastplate of Chaos":
          return "../assets/quiver/quibody.gif";
      case "Breastplate of Vengence":
          return "../assets/quiver/quibody2.gif";
      case "Aegis of Energy":
          return "../assets/quiver/quishield.gif";
      case "Top-Hat of Insanity":
          return "../assets/garland/garhead.gif";
      case "Belt of Safety":
          return "../assets/garland/garbelt.gif";
      case "Kite Shield of Fixation":
          return "../assets/garland/garshield.gif";
      case "Wicked Gorget of Force":
          return "../assets/garland/garneck.gif";
      case "Animated Boots of Valor":
          return "../assets/garland/garshoes.gif";
      case "Runic Shield of Spectral Warding":
          return "../assets/tylos/tylshield.gif";
      case "Belt of Popstar Flesh":
          return "../assets/tylos/tylbelt.gif";
      case "Ring of Profusion":
          return "../assets/tylos/tylring.gif";
      case "Warlord's Belt of Battle":
          return "../assets/threk/thrbelt.gif";
      case "Breastplate of Slaughter":
          return "../assets/threk/thrbody.gif";
      case "Gatling Gun of Compassion":
          return "../assets/threk/thrweapon.gif";
      case "Medallion of Eradication":
          return "../assets/threk/thrneck.gif";
      case "Belt of Glamour":
          return "../assets/jazzmin/jazbelt.gif";
      case "Beaded Necklace of Affluence":
          return "../assets/jazzmin/jazneck.gif";
      case "Cap of Supernal Force":
          return "../assets/jazzmin/jazhead.gif";
      case "Shoes of Nimbility":
          return "../assets/jazzmin/jazshoes.gif";
      case "Amulet of Gazing Dread":
          return "../assets/sigil/signeck.gif";
      case "Great Blade of Ferocity":
          return "../assets/sigil/sigweapon.gif";
      case "Ring of Pulsing Energy":
          return "../assets/sigil/sigring.gif";
      case "Breastplate of Vigilant Combat":
          return "../assets/sigil/sigbody.gif";
    }

    if(item.name === "Sacred Blade of the Order"){
      return "../assets/sacredbladeoftheorder.gif";
    }

    if(item.name === "Bracer of Death"){
      return "../assets/bracerofdeath.gif";
    }

    if(item.name === "Bracer of Life"){
      return "../assets/braceroflife.gif";
    }

    if(item.name === "Dead Eye"){
      return "../assets/deadeye.gif";
    }

    
    return "resolve image path went wrong! - replace with default img"
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
    }
  }

  getInventoryItemsSignal() {
    return this.inventoryItemsSignal;
  }

  title = 'micro-outwar';
  activeItem = '';
}

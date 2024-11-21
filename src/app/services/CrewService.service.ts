import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Item, UserResponse } from './PlayerProfileService.service';

export interface Crew{
  id: number,
  name: string,
  crewLeaderId: number,
  Members: UserResponse[],
  VaultItems: Item[]
}

@Injectable({
  providedIn: 'root',
})
export class CrewService {
  // Signal to hold the user state
  public userSignal = signal<UserResponse | null>(null);
  public crewSignal = signal<Crew | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.getCrewByName();
  }

  getCrewByName(crewName: string){
    const url = `https://localhost:44338/get-crew?crewName=${crewName}`
    this.http.get(url).subscribe({
      next: (response) => {
        console.log('crew data:', response);
        this.crewSignal.set(response as Crew);
        // this.generateEquipedItems(response as UserResponse);
      },
      error: (error) => {
        console.error('Error getting crew:', error);
      },
    });
  }

  createRaid(raidName: string){
    if(this.userSignal()?.name === undefined || this.userSignal()?.name === null){
      this.getUserByUsername('test1')
      return;
    }

    const url = `https://localhost:44338/create-raid?crewName=${this.crewSignal()?.name}&createdBy=${this.userSignal()?.name}&raidName=${raidName}`
    this.http.post(url, null).subscribe({
      next: (response) => {
        console.log('create raid:', response);
        
      },
      error: (error) => {
        console.error('Error creating raid:', error);
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
        console.error('Error getting user:', error);
      },
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

  title = 'micro-outwar';
  activeItem = '';
}

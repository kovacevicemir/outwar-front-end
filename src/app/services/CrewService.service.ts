import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  Item,
  PlayerProfileServiceService,
  UserResponse,
} from './PlayerProfileService.service';
import { environment } from '../../environments/environment';

export interface Crew {
  id: number;
  name: string;
  crewLeaderId: number;
  members: UserResponse[];
  vaultItems: Item[];
}

export interface Raid {
  id: number;
  raidName: string;
  raidMembers: UserResponse[];
  createdBy: UserResponse;
  hpLeft: number;
}

@Injectable({
  providedIn: 'root',
})
export class CrewService {
  // Signal to hold the user state
  public userSignal = signal<UserResponse | null>(null);
  public crewSignal = signal<Crew | null>(null);
  public activeRaids = signal<Raid[] | null>(null);

  constructor(
    private http: HttpClient,
    private playerProfileService: PlayerProfileServiceService
  ) {}

  ngOnInit() {
    // this.getCrewByName();
  }

  async attackRaid(raidName: string): Promise<any> {
    const url = `${environment.baseUrl}/attack-raid?crewName=${
      this.crewSignal()?.name
    }&raidName=${raidName}`;
    try {
      const response = await this.http.post(url, null).toPromise();
      return response;
    } catch (error) {
      console.error('Error attacking raid:', error);
      throw error;
    }
  }

  async createCrew(crewName: string): Promise<any> {
    if (
      this.playerProfileService.userSignal()?.name == undefined ||
      this.playerProfileService.userSignal()?.name == null
    ) {
      this.playerProfileService.getUserByUsername('test1');
      return;
    }

    const url = `${
      environment.baseUrl
    }/create-crew?crewName=${crewName}&crewLeaderId=${
      this.playerProfileService.userSignal()?.id
    }`;
    try {
      const response = await this.http.post(url, null).toPromise();
      return response;
    } catch (error) {
      console.error('Error creating crew:', error);
      throw error;
    }
  }

  getCrewRaids(crewName: string) {
    const url = `${environment.baseUrl}/get-crew-raids?crewName=${crewName}`;
    this.http.get(url).subscribe({
      next: (response) => {
        this.activeRaids.set(response as Raid[]);
      },
      error: (error) => {
        console.error('Error getting crew:', error);
      },
    });
  }

  getCrewByName(crewName: string) {
    const url = `${environment.baseUrl}/get-crew?crewName=${crewName}`;
    this.http.get(url).subscribe({
      next: (response) => {
        this.crewSignal.set(response as Crew);
        // this.generateEquipedItems(response as UserResponse);
      },
      error: (error) => {
        console.error('Error getting crew:', error);
      },
    });
  }

  async createRaid(raidName: string) {
    if (
      this.playerProfileService.userSignal()?.name == undefined ||
      this.playerProfileService.userSignal()?.name == null
    ) {
      this.playerProfileService.getUserByUsername('test1');
      return;
    }

    const url = `${environment.baseUrl}/create-raid?crewName=${
      this.crewSignal()?.name
    }&createdBy=${
      this.playerProfileService.userSignal()?.name
    }&raidName=${raidName}`;
    try {
      const response = await this.http.post(url, null).toPromise();
      return response;
    } catch (error) {
      console.error('Error creating raid:', error);
      throw error;
    }
  }

  getUserByUsername(username: string) {
    this.playerProfileService.getUserByUsername(username);
    const url = `${environment.baseUrl}/get-user-by-username?username=${username}`;
    this.http.get(url).subscribe({
      next: (response) => {
        this.userSignal.set(response as UserResponse);
      },
      error: (error) => {
        console.error('Error getting user:', error);
      },
    });
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

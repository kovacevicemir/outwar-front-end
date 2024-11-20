import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import worldDefinitions from '../../data/WorldDefinitions.json';

interface WorldLocation {
  id: number;
  name: string;
  monsters: string[];
  npcs: string[];
}

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss'],
})
export class WorldComponent implements OnInit {
  playerLocation = [4, 0];
  currentLocationDetails: WorldLocation = {
    id: 1,
    name: 'first street',
    monsters: ['Monster 1'],
    npcs: [],
  };
  roomIds = [
    5, 40, 43, 53, 66, 2, 3, 9, 15, 17, 35, 39, 46, 52, 58, 59, 51, 55, 49, 47,
    62, 7, 18, 34, 19, 18, 22, 10, 21, 32, 30, 28, 26, 13, 12, 71, 72, 69, 73,
    74,
  ];
  waterIds = [63];
  subwayIds = [44];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUserByUsername('test1');
  }

  getUserByUsername(username: string) {
    const url = `https://localhost:44338/get-user-by-username?username=${username}`;
    this.http.get(url).subscribe({
      next: (response) => {
        console.log('User data:', response);
        // @ts-ignore
        this.playerLocation = response.location;
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }

  isPlayerLocation(row: number, col: number): boolean {
    return this.playerLocation[0] === row && this.playerLocation[1] === col;
  }

  isRoom(cell: number): boolean {
    return this.roomIds.includes(cell);
  }
  isWater(cell: number): boolean {
    return this.waterIds.includes(cell);
  }
  isSubway(cell: number): boolean {
    return this.subwayIds.includes(cell);
  }

  changeLocation(direction: string): void {
    const url = `https://localhost:44338/change-user-location?username=test1&direction=${direction}`;
    this.http.post(url, null).subscribe({
      next: (response) => {
        console.log('Change user location response:', response);
        //@ts-ignore
        this.playerLocation = response;
        const currentLocationDetails = this.getLocationDetails();
        if(currentLocationDetails){
          this.currentLocationDetails = currentLocationDetails
        }
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }

  gameMap: number[][] = [
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 14, 14, 14, 14, 14, 14, 14, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 15, 0, 0, 16, 0, 35, 0, 0, 0, 0,
      39, 41, 0, 0, 0, 0, 0, 0, 53, 50, 0, 0, 0, 0, 58, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 17, 16, 0, 38, 38, 38, 0, 0,
      0, 41, 0, 0, 0, 45, 46, 0, 0, 50, 52, 0, 56, 57, 57, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 2, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 16, 0, 33, 0, 40, 43, 0,
      0, 41, 0, 0, 0, 45, 0, 0, 51, 50, 0, 59, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      1, 1, 1, 1, 4, 4, 4, 6, 6, 7, 6, 6, 6, 6, 6, 6, 16, 0, 33, 0, 42, 42, 42,
      42, 41, 0, 0, 0, 45, 0, 0, 0, 50, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 3, 0, 0, 0, 0, 0, 5, 8, 0, 0, 19, 0, 0, 0, 16, 0, 33, 0, 0, 0, 0, 0,
      41, 0, 0, 47, 45, 0, 0, 0, 50, 54, 54, 56, 60, 60, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 18, 16, 0, 33, 36, 36, 36,
      37, 0, 41, 0, 0, 0, 45, 0, 0, 49, 50, 55, 0, 56, 0, 63, 63, 63, 63, 0, 0,
      0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 10, 8, 20, 0, 22, 0, 0, 0, 16, 0, 33, 0, 0, 0, 0,
      0, 41, 44, 44, 44, 45, 48, 48, 48, 48, 0, 0, 56, 0, 62, 0, 0, 63, 0, 0, 0,
      0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
      11, 11, 11, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 61, 61, 0, 0, 63, 0, 0,
      0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 21, 0, 23, 0, 0, 0, 32, 0, 0, 0, 31, 0,
      0, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 31, 0, 0,
      41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 0, 0, 0, 0, 0, 0, 0, 0, 65, 64, 64, 63, 63, 63, 63, 0, 0,
      0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 30, 0,
      29, 0, 0, 0, 0, 0, 71, 0, 0, 0, 65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 0, 0, 0, 0, 0, 0, 25, 0, 0, 28, 0, 0, 0, 0,
      29, 0, 0, 0, 0, 0, 70, 0, 0, 0, 65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 13, 0, 12, 0, 0, 0, 0, 0, 0, 25, 27, 27, 27, 27, 27,
      27, 27, 27, 0, 0, 0, 0, 0, 70, 0, 0, 0, 65, 67, 67, 0, 0, 0, 0, 0, 0, 0,
      0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 72, 0, 70, 0, 0, 69, 65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 68, 68, 68, 68, 68, 68, 68, 65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 25, 25, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 74, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
  ];

  attackMonster(monster: any){
    console.log("todo")
  }

  getLocationDetails() {
    const [x, y] = this.playerLocation;

    // Validate coordinates
    if (
      x < 0 ||
      y < 0 ||
      x >= this.gameMap.length ||
      y >= this.gameMap[x].length
    ) {
      console.error('Player location is out of bounds.');
      return undefined;
    }

    // Get the ID from this.gameMap
    const locationId = this.gameMap[x][y];

    // Find the entry in WorldDefinitions
    const locationDetails = worldDefinitions.find(
      (entry: WorldLocation) => entry.id === locationId
    );

    if (!locationDetails) {
      console.warn(`No matching location found for ID: ${locationId}`);
    }

    return locationDetails;
  }

  // Listen for keypress events
  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    switch (event.key.toLowerCase()) {
      case 'w':
        this.changeLocation('up');
        break;
      case 'a':
        this.changeLocation('left');
        break;
      case 's':
        this.changeLocation('down');
        break;
      case 'd':
        this.changeLocation('right');
        break;
      default:
        // Ignore other keys
        break;
    }
  }

  transposedMap: number[][] = [];
}

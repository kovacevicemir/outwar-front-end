import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import quests from '../../data/Quests.json';
import experienceList from '../../data/experienceList.json';

// I just runned .map on world.json file to extract this...
export const worldIdToStreetName = [
  "1 Shadow Path",
  "2 Training Grounds",
  "3 Wastelands",
  "4 Diamond City Gates",
  "5 Dusty Glass Tavern",
  "6 Main Street",
  "7 Intersection Main/Angelio",
  "8 Angelio Street",
  "9 Dominic's Restaurant",
  "10 Rancid's Wasteland Camp",
  "11 Broadway Street",
  "12 Hospital Waiting Room",
  "13 Emergency Room",
  "14 Carmine Street",
  "15 City Hall",
  "16 Beldam Street",
  "17 The Foundry",
  "18 Blackheart's Bank",
  "19 DC Enforcers",
  "20 Subway to Industrial Way",
  "21 Holy Cathedral",
  "22 Soundweaver Academy",
  "23 Binding Avenue",
  "24 Binding Drive",
  "25 Anger Blvd",
  "26 Reel Theatre",
  "27 South Main Street",
  "28 40s and 9s",
  "29 S. Main St. Alley",
  "30 Diamond City Colesium",
  "31 Loomis Ave",
  "32 Underground Casino",
  "33 Red Light Square",
  "34 Fat Tony's Night Club",
  "35 Fight Arena",
  "35 Fight Arena",
  "36 Parson's Lane",
  "37 Construction Site",
  "38 Industrial Way",
  "39 Synge Destruction Area",
  "40 Subway to West Broadway Street",
  "41 Morgan's Way",
  "42 The Bowery",
  "43 Chuggers Palace Bar",
  "44 Subway Trains",
  "45 TechSound Drive",
  "46 Sound Laboratory",
  "47 Concert Hall",
  "48 Nihilim Road",
  "49 Cement Block Company",
  "50 Popular Street",
  "51 Statue of Terrance",
  "52 Hall of Fame",
  "53 The Drunken Clam",
  "54 Tremolo Way",
  "55 Warehouse",
  "56 Docks",
  "57 Pier 1 Rallis",
  "58 Sunken Boat",
  "59 Boat House",
  "60 Pier 2 Rallis",
  "61 Pier 3 Rallis",
  "62 Gunsmoke's Boat",
  "63 Transport Boat/Rallis W",
  "64 Pier 1 Stizzy",
  "65 Docks",
  "66 Hard Iron Salon",
  "67 Pier 2 Stizzy",
  "68 Iron Edge Street",
  "69 Sunny's Park",
  "70 East Rock Shore",
  "71 Cabbage Hill",
  "72 Dockside Lounge",
  "73 Tidal Bay",
  "74 Foggy Shore"
]


@Component({
  selector: 'app-wiki-page',
  templateUrl: './wiki-page.component.html',
  styleUrls: ['./wiki-page.component.css'],
  imports: [CommonModule, MatListModule, MatFormFieldModule, ReactiveFormsModule, MatIcon ],
  standalone: true
})
export class WikiPageComponent implements OnInit {

  dropList: null | ItemData = null;
  filteredDropList: null | ItemData = null;
  form = new FormGroup({
    search: new FormControl('')
  });
  worldIdToStreetName = worldIdToStreetName;
  quests = quests;
  experienceList = experienceList;


  constructor(private http: HttpClient) { }

  ngOnInit() {
    if(this.dropList == null){
      this.getDropList();
    }

    // Listen for search input
    this.form.get('search')?.valueChanges.subscribe(value => {
        this.filterDropList(value || "");
        console.log('Search term:', value);
    });
  }

  async getDropList(): Promise<any>{
    const url = `${environment.baseUrl}/get-droplist`;
    try {
      const response = await this.http.get(url).toPromise();
      if(response !== undefined){
        this.dropList = response as ItemData;
        this.filteredDropList = response as ItemData;
      }
    } catch (error) {
      console.error('Error fetching drop list:', error);
      throw error;
    }
  }

  filterDropList(searchTerm: string): void {
    if (!this.dropList) return;

    if(searchTerm === ""){
      this.filteredDropList = this.dropList;
    }
  
    const lowerSearch = searchTerm.toLowerCase();
  
    const filtered: ItemData = Object.entries(this.dropList)
      .filter(([key]) => key.toLowerCase().includes(lowerSearch))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as ItemData);

    this.filteredDropList = filtered;
  }

}

export interface ItemData {
  [itemName: string]: {
    monsterNames: string[];
    monsterLocations: string[];
  };
}

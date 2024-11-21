import { Component, effect, OnInit } from '@angular/core';
import { CrewService } from '../../services/CrewService.service';
import { CommonModule } from '@angular/common';
import { PlayerProfileServiceService } from '../../services/PlayerProfileService.service';
import { ActivatedRoute } from '@angular/router';
import gods from "../../data/Gods.json"

interface God{
  Name: string,
  LevelRequirement: number,
  Attack: number,
  Hp: number,
  Drops: string[],
  DropsChance: number[],
  imageUrl: string
}

@Component({
  selector: 'app-crew-page',
  templateUrl: './crew-page.component.html',
  styleUrls: ['./crew-page.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class CrewPageComponent implements OnInit {
  crew = this.crewService.crewSignal.asReadonly();
  user = this.playerProfileService.userSignal.asReadonly();
  gods:God[] = [];
  collapseState: { [key: string]: boolean } = {};

  // Toggle collapse for an item based on its name or index
  toggleCollapse(item: any): void {
    // You can use either `item.Name` or `index` as the key
    this.collapseState[item.Name] = !this.collapseState[item.Name];
  }

  constructor(
    private route: ActivatedRoute,
    private crewService: CrewService,
    private playerProfileService: PlayerProfileServiceService
  ) {
    this.gods = gods;
    console.log("gods: ",gods)

    effect(() => {
      const user = this.user(); //track user signal change
      const crewNameParam = this.route.snapshot.queryParamMap.get('crewName');
      if (user !== null && crewNameParam === null) {
        this.fetchCrewByUser();
      }

      if(user === null && crewNameParam === null){
        this.playerProfileService.getUserByUsername('test1');
      }
    });
  }

  ngOnInit() {
    if(this.user() === null){
      this.playerProfileService.getUserByUsername('test1');
    }

    const crewName = this.route.snapshot.queryParamMap.get('crewName');
    if (crewName) {
      this.fetchCrewByName(crewName)
      return;
    }else{
      this.fetchCrewByUser()
    }
    ;
  }

  fetchCrewByName(crewName: string) {
    //Simply fetch crew using param
    if (crewName) {
      this.crewService.getCrewByName(crewName);
    }
  }

  fetchCrewByUser(){
    if (this.user()?.crewName !== null) {
      this.crewService.getCrewByName(this.user()?.crewName as string);
      return;
    }
  }

  // <h2>Do not have crew and /crew url ?</h2>
  // <h2>Do not have crew and /crew?id=x url (crew profile view)?</h2>
  // <h2>Have crew (crew profile)</h2>
}

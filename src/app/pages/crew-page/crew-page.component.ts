import { Component, effect, OnInit } from '@angular/core';
import { CrewService } from '../../services/CrewService.service';
import { CommonModule } from '@angular/common';
import { PlayerProfileServiceService } from '../../services/PlayerProfileService.service';
import { ActivatedRoute } from '@angular/router';
import gods from '../../data/Gods.json';

interface God {
  Name: string;
  LevelRequirement: number;
  Attack: number;
  Hp: number;
  Drops: string[];
  DropsChance: number[];
  imageUrl: string;
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
  activeRaids = this.crewService.activeRaids.asReadonly();
  user = this.playerProfileService.userSignal.asReadonly();
  gods: God[] = [];
  collapseState: { [key: string]: boolean } = {};
  isModalOpen = false;
  modalContent = ``;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    window.location.reload();
  }

  // Toggle collapse for an item based on its name or index
  toggleCollapse(item: any): void {
    // You can use either `item.Name` or `index` as the key
    this.collapseState[item.Name] = !this.collapseState[item.Name];
  }

  async formRaid(raidName: string) {
    const res = await this.crewService.createRaid(raidName);
    if (res) {
      this.modalContent = `${raidName} raid formed!`;
      this.isModalOpen = true;
    }
  }

  async createCrew(crewName: string) {
    const res = await this.crewService.createCrew(crewName);
    if (res) {
      window.location.reload();
    }
  }

  constructor(
    private route: ActivatedRoute,
    private crewService: CrewService,
    private playerProfileService: PlayerProfileServiceService
  ) {
    this.gods = gods;

    effect(() => {
      const user = this.user(); //track user signal change
      const crewNameParam = this.route.snapshot.queryParamMap.get('crewName');
      if (user !== null && crewNameParam === null) {
        this.fetchCrewByUser();
        this.crewService.getCrewRaids(this.user()?.crewName as string);
      }

      if (user === null && crewNameParam === null) {
        this.playerProfileService.getUserByUsername('test1');
      }
    });
  }

  getLeaderName() {
    const members = this.crew()?.members || [];
    const crewLeaderId = this.crew()?.crewLeaderId
    const leader = members.find(
      (m) => m.id === crewLeaderId
    );
    return leader?.name ?? 'N/A';
  }

  isActiveRaid(raidName: string) {
    const raids = this.activeRaids();
    if (raids === null) {
      return false;
    }

    if (raids?.find((e) => e.raidName === raidName)) {
      return true;
    }

    return false;
  }

  canLaunchRaid(raidName: string) {
    const raids = this.activeRaids();
    const user = this.user();
    if (raids === null || user === null) {
      return false;
    }

    if (
      raids?.find(
        (e) => e.raidName === raidName && e.createdBy.name === user.name
      )
    ) {
      return true;
    }

    return false;
  }

  getUserName(): string {
    try {
      const name = this.user()?.name;
      if (name !== undefined && name !== null) {
        return name.toString();
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }

    return '';
  }

  showRaidButton(raidName: string) {
    const name = this.getUserName();
    const raidMembers = this.getRaidMembers(raidName);

    if (raidMembers.find((m) => m.name === name)) {
      return false;
    }

    return true;
  }

  getRaidMembers(raidName: string) {
    const raids = this.activeRaids();
    if (raids === null) {
      return [];
    }

    const raid = raids?.find((e) => e.raidName === raidName);
    if (raid) {
      return raid.raidMembers;
    }

    return [];
  }

  async attackRaid(raidName: string) {
    const finalRes = await this.crewService.attackRaid(raidName);
    this.modalContent = finalRes;
    this.isModalOpen = true;
  }

  getHpLeft(raidName: string) {
    const raids = this.activeRaids();
    if (raids === null) {
      return 0;
    }

    const raid = raids?.find((e) => e.raidName === raidName);
    if (raid) {
      return raid.hpLeft;
    }

    return 0;
  }

  ngOnInit() {
    if (this.user() === null) {
      this.playerProfileService.getUserByUsername('test1');
    }

    const crewName = this.route.snapshot.queryParamMap.get('crewName');
    if (crewName) {
      this.fetchCrewByName(crewName);
    } 
  }

  fetchCrewByName(crewName: string) {
    //Simply fetch crew using param
    if (crewName) {
      this.crewService.getCrewByName(crewName);
    }
  }

  fetchCrewByUser() {
    if (this.user()?.crewName !== null) {
      this.crewService.getCrewByName(this.user()?.crewName as string);
      return;
    }
  }

  // <h2>Do not have crew and /crew url ?</h2>
  // <h2>Do not have crew and /crew?id=x url (crew profile view)?</h2>
  // <h2>Have crew (crew profile)</h2>
}

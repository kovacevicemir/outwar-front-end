import { Component, computed, OnInit } from '@angular/core';
import { PlayerProfileServiceService } from '../../services/PlayerProfileService.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import experienceList from '../../data/experienceList.json';

@Component({
  selector: 'app-player-top-bar-info',
  templateUrl: './player-top-bar-info.component.html',
  styleUrls: ['./player-top-bar-info.component.css'],
  standalone: true,
  imports: [CommonModule, MatTooltipModule ]
}) 
export class PlayerTopBarInfoComponent implements OnInit {

  user = this.playerProfileService.userSignal.asReadonly();
  playerStatsSummary = this.playerProfileService.playerStatsSummary.asReadonly();
  expNeeded = computed(() => this.generateNeededExp());

  constructor(private playerProfileService: PlayerProfileServiceService) {}

  generateNeededExp(){
    const userLevel = this.user()?.level || 0
    const expNeeded = experienceList.find(e => e.level === (userLevel +1))
    return expNeeded?.experience
  }

  ngOnInit() {
    if(this.user() === null){
      this.refetchUser();
      this.generateNeededExp();
    }
  }

  async refetchUser(){
    await this.playerProfileService.getUserByUsername('test1');
  }

}

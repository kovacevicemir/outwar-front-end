import { Component, OnInit } from '@angular/core';
import { PlayerProfileServiceService } from '../../services/PlayerProfileService.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PlayerStatsComponent implements OnInit {

  playerStatsSummary = this.playerProfileService.playerStatsSummary.asReadonly();

  constructor(private playerProfileService: PlayerProfileServiceService) {}

  ngOnInit() {

  }

}

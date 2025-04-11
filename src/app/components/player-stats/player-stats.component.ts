import { Component } from '@angular/core';
import { PlayerProfileServiceService } from '../../services/PlayerProfileService.service';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css'],
  standalone: true,
  imports: [],
})
export class PlayerStatsComponent {
  playerStatsSummary =
    this.playerProfileService.playerStatsSummary.asReadonly();
  user = this.playerProfileService.userSignal.asReadonly();

  constructor(private playerProfileService: PlayerProfileServiceService) {}
}

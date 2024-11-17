import { Component, OnInit } from '@angular/core';
import { InventoryComponent } from '../../components/inventory/inventory.component';
import { EquipedItemsRedoComponent } from '../../components/equiped-items-redo/equiped-items-redo.component';
import { PlayerStatsComponent } from '../../components/player-stats/player-stats.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  standalone: true,
  imports: [InventoryComponent, EquipedItemsRedoComponent, PlayerStatsComponent]
})
export class ProfilePageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

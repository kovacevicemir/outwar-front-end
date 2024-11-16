import { Component, OnInit } from '@angular/core';
import { EquipedItemsModule } from '../../components/equiped-items/equiped-items.module';
import { InventoryComponent } from '../../components/inventory/inventory.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  standalone: true,
  imports: [EquipedItemsModule, InventoryComponent]
})
export class ProfilePageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { EquipedItemsModule } from '../../components/equiped-items/equiped-items.module';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  standalone: true,
  imports: [EquipedItemsModule]
})
export class ProfilePageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

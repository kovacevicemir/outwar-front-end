import { Component, OnInit } from '@angular/core';
import { WorldModule } from '../../components/world/world.module';

@Component({
  selector: 'app-diamond-city-page',
  templateUrl: './diamond-city-page.component.html',
  styleUrls: ['./diamond-city-page.component.css'],
  standalone: true,
  imports: [WorldModule]
})
export class DiamondCityPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

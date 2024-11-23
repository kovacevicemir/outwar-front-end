import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.css'],
  imports: [RouterOutlet],
  standalone: true
})
export class DefaultPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

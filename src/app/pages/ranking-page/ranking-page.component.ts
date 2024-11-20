import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

[
  {
      "name": "Name 1",
      "level": 1,
      "experience": 0
  },
  {
      "name": "Name 2",
      "level": 1,
      "experience": 0
  },
  {
      "name": "Name 3",
      "level": 1,
      "experience": 0
  },
  {
      "name": "newuser",
      "level": 1,
      "experience": 0
  },
  {
      "name": "test1",
      "level": 12,
      "experience": 5987
  }
]

interface RankingObject{
  name:string,
  level: number,
  experience: number
}

@Component({
  selector: 'app-ranking-page',
  templateUrl: './ranking-page.component.html',
  styleUrls: ['./ranking-page.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class RankingPageComponent implements OnInit {
  ranking: RankingObject[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getRanking()
  }

  getRanking() {
    const url = `https://localhost:44338/get-ranking`;
    this.http.get(url).subscribe({
      next: (response) => {
        if(response){
          this.ranking = response as [];

          console.log("this is ranking: ",this.ranking)
        }
      },
      error: (error) => {
        console.error('Error fetching ranking:', error);
      },
    });
  }

}

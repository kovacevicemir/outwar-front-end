import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

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
    const url = `${environment.baseUrl}/get-ranking`;
    this.http.get(url).subscribe({
      next: (response) => {
        if(response){
          this.ranking = response as [];
        }
      },
      error: (error) => {
        console.error('Error fetching ranking:', error);
      },
    });
  }

}

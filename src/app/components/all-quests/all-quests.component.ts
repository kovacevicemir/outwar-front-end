import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Monsters from '../../data/Monsters.json';
import {MatIconModule} from '@angular/material/icon';

export interface Quest {
  id: number; // Unique identifier for the quest
  name: string; // Name of the quest
  status: number; // Quest status (0 = Started, 1 = Completed, etc.)
  gotReward: number; // Did user take reward? 0 = no, 1 = yes

  // Which monsters to be killed for quests
  monsterIds: number[]; 

  // List of quest requirements
  // For example [10, 10, 10] means it needs to kill or collect 10 monsters/items
  requirements: number[];

  // Same as above but keeps track of progress
  progress: number[];

  exp: number; // Experience points as reward
  itemRewardNames: string[]; // Items awarded as a reward
}

interface ExtendedResponseType{
  quests: Quest[]
}

@Component({
  selector: 'app-all-quests',
  templateUrl: './all-quests.component.html',
  styleUrls: ['./all-quests.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class AllQuestsComponent implements OnInit {
  allQuests:Quest[] = []
  displayedQuests: Quest[] = []
  collapsedState: boolean[] = this.allQuests.map(() => true);
  showActiveOnly = true;
  monsters = Monsters;
  questCompletedMessage = '';

  toggleCollapse(index: number): void {
    this.collapsedState[index] = !this.collapsedState[index];
  }

  isCollapsed(index: number): boolean {
    return this.collapsedState[index];
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getAllQuests()
  }

  refreshQuests(){
    this.getAllQuests()
    this.showActiveOnly = true
    this.questCompletedMessage = ''
  }

  async completeQuest(questName:string){
    const url = `https://localhost:44338/get-quest-reward?username=test1&questName=${questName}`;
    try {
      const response = await this.http.post(url,NgTemplateOutlet).toPromise();
      if(response){ //Basically tricking typescript telling it to expect string in response
        const res = response as string;
        this.questCompletedMessage = res;
      }
      console.log(response)
    } catch (error) {
      console.error('Error completing quest:', error);
      //@ts-ignore
      this.questCompletedMessage = error.error 
      throw error;
    }
  }

  toogleActive(){
    console.log("Before: ",this.showActiveOnly)
    if(this.showActiveOnly === true){
      const q = this.allQuests.filter(q => {return q.gotReward === 0})
      this.displayedQuests = q
    }else{
      console.log("this.allQuests: ",this.allQuests)
      this.displayedQuests = [...this.allQuests];
    }
  }

  async getAllQuests(): Promise<any>{
    const url = `https://localhost:44338/get-all-quests?username=test1`;
    try {
      const response = await this.http.get(url).toPromise();
      if(response){ //Basically tricking typescript telling it to expect quests in response
        const res = response as ExtendedResponseType;
        this.allQuests = res.quests
        const c = res.quests.filter(q => {return q.gotReward === 0})
        this.displayedQuests = c
      }
      console.log(response)
    } catch (error) {
      console.error('Error starting quest:', error);
      throw error;
    }
  }

}

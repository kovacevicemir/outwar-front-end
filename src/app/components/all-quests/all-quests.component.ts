import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Monsters from '../../data/Monsters.json';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { QuestService } from '../../services/QuestService.service';

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

interface ExtendedResponseType {
  quests: Quest[];
}

@Component({
  selector: 'app-all-quests',
  templateUrl: './all-quests.component.html',
  styleUrls: ['./all-quests.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
})
export class AllQuestsComponent implements OnInit {
  allQuests = this.questService.allQuests;
  displayedQuests = this.questService.displayedQuests;
  collapsedState: boolean[] = this.allQuests()?.map(() => true);
  showActiveOnly = true;
  monsters = Monsters;
  questCompletedMessage = '';

  constructor(private http: HttpClient, private questService: QuestService) {}

  toggleCollapse(index: number): void {
    this.collapsedState[index] = !this.collapsedState[index];
  }

  isCollapsed(index: number): boolean {
    return this.collapsedState[index];
  }

  ngOnInit() {
    if (
      this.questService.allQuests().length === 0 ||
      this.questService.displayedQuests().length === 0
    ) {
      this.questService.getAllQuests();
    }
  }

  refreshQuests() {
    this.questService.getAllQuests();
    this.showActiveOnly = true;
    this.questCompletedMessage = '';
  }

  async completeQuest(questName: string) {
    try {
      const response = await this.questService.completeQuest(questName)
      if (response) {
        //Basically tricking typescript telling it to expect string in response
        const res = response as string;
        this.questCompletedMessage = res;
      }
    } catch (error) {
      console.error('Error completing quest:', error);
      //@ts-ignore
      this.questCompletedMessage = error.error;
      throw error;
    }
  }

  toogleActive() {
    if (this.showActiveOnly === true) {
      const q = this.allQuests().filter((q) => {
        return q.gotReward === 0;
      });
      this.questService.displayedQuests.set(q);
    } else {
      this.questService.displayedQuests.set([...this.allQuests()]);
    }
  }

  // async getAllQuests(): Promise<any>{
  //   try {
  //     const response = await this.questService.getAllQuests();
  //     if(response){ //Basically tricking typescript telling it to expect quests in response
  //       const res = response as ExtendedResponseType;
  //       this.allQuests = res.quests
  //       const c = res.quests.filter(q => {return q.gotReward === 0})
  //       this.displayedQuests = c
  //     }
  //   } catch (error) {
  //     console.error('Error starting quest:', error);
  //     throw error;
  //   }
  // }
}

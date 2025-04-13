import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Quest } from '../components/all-quests/all-quests.component';
import { PlayerProfileServiceService } from './PlayerProfileService.service';

interface ExtendedResponseType {
  quests: Quest[];
}

@Injectable({
  providedIn: 'root',
})
export class QuestService {
  public allQuests = signal<Quest[]>([]);
  public displayedQuests = signal<Quest[]>([]);
  constructor(private http: HttpClient, private playerProfileService: PlayerProfileServiceService) {}

  async startQuest(questName: string): Promise<any> {
    const url = `${environment.baseUrl}/start-quest?username=test1&questName=${questName}`;
    try {
      const response = await this.http.post(url, null).toPromise();

      return response;
    } catch (error) {
      console.error('Error starting quest:', error);
      throw error;
    }
  }

  async getAllQuests(): Promise<any> {
    const url = `${environment.baseUrl}/get-all-quests?username=test1`;
    try {
      const response = await this.http.get(url).toPromise();
      if (response) {
        //Basically tricking typescript telling it to expect quests in response
        const res = response as ExtendedResponseType;
        this.allQuests.set(res.quests);
        const c = res.quests.filter(q => {return q.gotReward === 0})
        this.displayedQuests.set(c);
      }
    } catch (error) {
      console.error('Error starting quest:', error);
      throw error;
    }
  }

  async completeQuest(questName: string) {
      const url = `${environment.baseUrl}/get-quest-reward?username=test1&questName=${questName}`;
      try {
        const response = await this.http.post(url, null).toPromise();
        if (response) {
          //Basically tricking typescript telling it to expect string in response
          const res = response as string;
          await this.playerProfileService.getUserByUsername(); //this will refresh user and fetch inventory items (rewards)
          return res;
        }

        return "Something went wrong, please try again."
      } catch (error) {
        console.error('Error completing quest:', error);
        //@ts-ignore
        this.questCompletedMessage = error.error;
        throw error;
      }
    }
}

import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import experienceList from '../data/experienceList.json';
import { environment } from '../../environments/environment';
import { Quest } from '../components/all-quests/all-quests.component';

interface ExtendedResponseType {
  quests: Quest[];
}

@Injectable({
  providedIn: 'root',
})
export class QuestService {
  public allQuests = signal<Quest[]>([]);
  public displayedQuests = signal<Quest[]>([]);
  constructor(private http: HttpClient) {}

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
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SkillsServiceService {

constructor(private http: HttpClient) { }

async getAllActiveSkills(playerName: string): Promise<any>{
  const url = `https://localhost:44338/get-all-active-skills?userName=${playerName}`;
  try {
    const response = await this.http.get(url).toPromise();
    return response;
  } catch (error) {
    console.error('Error getting  active skills:', error);
    throw error;
  }
}

async increaseSkillLevel(playerName: string, skillName: string): Promise<any>{
  const url = `https://localhost:44338/increase-skill-level?userName=${playerName}&skillName=${skillName}`;
  try {
    const response = await this.http.post(url,null).toPromise();
    return response;
  } catch (error) {
    console.error('Error skill level increase:', error);
    throw error;
  }
}

async castSkill(playerName: string, skillName: string): Promise<any>{
  const url = `https://localhost:44338/cast-skill?userName=${playerName}&skillName=${skillName}`;
  try {
    const response = await this.http.post(url,null).toPromise();
    return response;
  } catch (error) {
    console.error('Error casting skill:', error);
    throw error;
  }
}

}

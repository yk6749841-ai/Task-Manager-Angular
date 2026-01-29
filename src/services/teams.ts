import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AddMember } from '../models/teams';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/teams`;
  getTeams() {
    return this.http.get<any[]>(this.apiUrl);
  }
  addTeam(name: string) {
    return this.http.post(this.apiUrl, { name: name });
  }
  addUserToTeam(teamId: number, memberData: AddMember) {
    const url = `${this.apiUrl}/${teamId}/members`;
    return this.http.post(url, memberData);
  }
}

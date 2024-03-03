import { Injectable } from '@angular/core';
import { Constants } from '../../config/constans';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { SignupData, User } from '../../model/signup_post';
@Injectable({
  providedIn: 'root'
})
export class CatmashService {


      constructor(private constants : Constants , private http : HttpClient){}
      public async LoginUser(username: string, password: string) {
        const url = this.constants.API_ENDPOINT + "/login/" + username + "/" + password;
        const response = await lastValueFrom(this.http.get(url));
        return response as User[];
      }


      public async SignupUser(name: string, username: string, password: string, type: string) {
        const url = this.constants.API_ENDPOINT + '/login/signup';
        const body = {
          username: username,
          name: name,
          password: password,
          type: type
        };
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        try {
          const response = await this.http.post(url, body, { headers: headers }).toPromise();
          console.log(response);
          return response as SignupData[];
        } catch (error) {
          throw error;
        }
      }
}
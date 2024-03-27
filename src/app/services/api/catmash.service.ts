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
        const url = this.constants.API_ENDPOINT + "/login/user/" + username + "/" + password;
        const response = await lastValueFrom(this.http.get(url));
        return response as User[];
      }
      public async GetloginUser(uid: number) {
        const url = this.constants.API_ENDPOINT + "/login/" + uid;
        const response = await lastValueFrom(this.http.get(url));
        return response as User[];
      }
      public async GetUserall() {
        const url = this.constants.API_ENDPOINT + "/login";
        const response = await lastValueFrom(this.http.get(url));
        return response as User[];
      }
      public async SignupUser(name: string, username: string, password: string, type: string, file: File) {
        const url = this.constants.API_ENDPOINT + '/login/signup';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username);
        formData.append('name', name);
        formData.append('password', password);
        formData.append('type', type);
    
        try {
            const response = await this.http.post(url, formData).toPromise();
            console.log(response);
            return response as SignupData[];
        } catch (error) {
            throw error;
        }
    }
}
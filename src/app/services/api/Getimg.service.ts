import { Injectable } from '@angular/core';
import { Constants } from '../../config/constans';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { GetImg, Getranktoday, ImgUser, VoteImg } from '../../model/Img';
import { User } from '../../model/signup_post';
@Injectable({
  providedIn: 'root'
})
export class Getimgservice {


      constructor(private constants : Constants , private http : HttpClient){}
      public async Getimg() {
        const url = this.constants.API_ENDPOINT + "/img";
        const response = await lastValueFrom(this.http.get(url));
        return response as GetImg[];
      }
      
      public async InsertVote(userid: number, imgid: number, score: number, isWinner: boolean ) {
        const url = this.constants.API_ENDPOINT + '/vote/insertimg';
        const body = {
          userid: userid,
          imgid: imgid,
          score: score,
          isWinner: isWinner,
        };
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        try {
          const response = await this.http.post(url, body, { headers: headers }).toPromise();
          return true;
        } catch (error) {
          throw error;
        }
      }
      public async Updateimg(imgid: number, score: number) {
        const url = this.constants.API_ENDPOINT + '/img/update/'+imgid;
        const body = {
          score: score,
        };
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        try {
          const response = await this.http.put(url, body, { headers: headers }).toPromise();
          return true;
        } catch (error) {
          throw error;
        }
      }
      public async GetRanktoday() {
        const url = this.constants.API_ENDPOINT + "/rank/today";
        const response = await lastValueFrom(this.http.get(url));
        return response as Getranktoday[];
      }
      public async GetRankyesterday() {
        const url = this.constants.API_ENDPOINT + "/rank/yesterday";
        const response = await lastValueFrom(this.http.get(url));
        return response as Getranktoday[];
      }

      public async GetGraph(uid: number) {
        const url = this.constants.API_ENDPOINT + "/rank/graph/" + uid;
        const response = await lastValueFrom(this.http.get(url));
        return response as VoteImg[];
      }

      public async GetimgUser(uid: number) {
        const url = this.constants.API_ENDPOINT + "/profile/" + uid;
        const response = await lastValueFrom(this.http.get(url));
        return response as ImgUser[];
      }
      public async GetUser(uid: number) {
        const url = this.constants.API_ENDPOINT + "/profile/seuser/" + uid;
        const response = await lastValueFrom(this.http.get(url));
        return response as User[];
      }
      public async insertimg(name: string, uid: number, file: File) {
        const url = this.constants.API_ENDPOINT + '/profile/addimg';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('uid', uid.toString()); // Convert uid to string
  
        try {
            const response = await this.http.post(url, formData).toPromise();
            console.log(response);
        } catch (error) {
            throw error;
        }
    }
    public async chageuser(name: string, note: string , uid: number,oldimg : string, file: File) {
      const url = this.constants.API_ENDPOINT + '/profile/changeuser';
      const formData = new FormData();
      formData.append('name', name);
      formData.append('note', note);
      formData.append('oldimg', oldimg);
      formData.append('file', file);
      formData.append('uid', uid.toString()); // Convert uid to string

      try {
          const response = await this.http.put(url, formData).toPromise();
          console.log(response);
      } catch (error) {
          throw error;
      }
  }

  public async chageusername(name: string, note: string , uid: number) {
    const url = this.constants.API_ENDPOINT + '/profile/upname';
    const body = {
      uid: uid,
      name: name,
      note: note,
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    try {
      const response = await this.http.put(url, body, { headers: headers }).toPromise();
      return true;
    } catch (error) {
      throw error;
    }
  }
  public async updatepass(password: string ,uid: number) {
    const url = this.constants.API_ENDPOINT + '/profile/uppass';
    const body = {
      uid: uid,
      password: password,
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    try {
      const response = await this.http.put(url, body, { headers: headers }).toPromise();
      return true;
    } catch (error) {
      throw error;
    }
  }
  public async Deleteimg(imgid : number,uid : number){
    const url = this.constants.API_ENDPOINT + '/profile/deleteimg/'+imgid+'/'+uid;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    try {
      const response = await this.http.delete(url, { headers: headers }).toPromise();
      return true;
    } catch (error) {
      throw error;
    }
  }
  public async Deleteurl(imgurl : string) {
    const url = this.constants.API_ENDPOINT + '/profile/Deleteurl';
    const body = {
      imgurl: imgurl,
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    try {
      const response = await this.http.put(url, body, { headers: headers }).toPromise();
      return true;
    } catch (error) {
      throw error;
    }
  }
  public async chageimguser(name: string ,imgid : number, uid: number,oldimg : string, file: File) {
    const url = this.constants.API_ENDPOINT + '/profile/changeimg';
    const formData = new FormData();
    formData.append('name', name);
    formData.append('oldimg', oldimg);
    formData.append('imgid', imgid.toString());
    formData.append('file', file);
    formData.append('uid', uid.toString());

    try {
        const response = await this.http.post(url, formData).toPromise();
        console.log(response);
        return true;
    } catch (error) {
        throw error;
    }
}
}
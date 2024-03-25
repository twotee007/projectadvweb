import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { GraphComponent } from './components/graph/graph.component';
import { OtherprofileComponent } from './components/otherprofile/otherprofile.component';
// import { UserListComponent } from './components/userlist/userlist.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserListComponent } from './components/userlist/userlist.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'ranking',component:RankingComponent},
    {path : 'profile',component:ProfileComponent},
    {path : 'login',component:LoginComponent},
    {path : 'graph',component:GraphComponent},
    {path : 'otherprofile',component:OtherprofileComponent},//ดึงuidเเล้วไม่ได้จ้ะ
    {path : 'admin',component:AdminComponent},
    {path : 'userlist',component:UserListComponent}

];

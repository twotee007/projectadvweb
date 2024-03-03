import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { RankingComponent } from './components/ranking/ranking.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'ranking',component:RankingComponent},
    {path : 'profile',component:ProfileComponent},
    {path : 'login',component:LoginComponent}

];

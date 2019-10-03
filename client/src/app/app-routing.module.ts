import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { GameComponent } from './page/game/game.component';
import { AdminComponent } from './page/admin/admin.component';


const routes: Routes = [
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'game',
    component: GameComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

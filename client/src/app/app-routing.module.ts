import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { GamesComponent } from './components/games/games.component';
import { GameComponent } from './components/game/game.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login-guard.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'home', component: GamesComponent, canActivate: [AuthGuard] },
  { path: 'games/:gid', component: GameComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

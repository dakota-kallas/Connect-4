import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { TokenComponent } from './components/token/token.component';
import { GameComponent } from './components/game/game.component';
import { ThemeComponent } from './components/theme/theme.component';
import { MetadataComponent } from './components/metadata/metadata.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    TokenComponent,
    GameComponent,
    ThemeComponent,
    MetadataComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

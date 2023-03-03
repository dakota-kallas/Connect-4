import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { TokenComponent } from './token/token.component';
import { GameComponent } from './game/game.component';
import { ThemeComponent } from './theme/theme.component';
import { MetadataComponent } from './metadata/metadata.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    TokenComponent,
    GameComponent,
    ThemeComponent,
    MetadataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { FormAudioComponent } from './components/form-audio/form-audio.component';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layouts/layout/layout.component';
import { withFetch } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    FormAudioComponent,
    LayoutComponent,
  ],
  providers: [
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
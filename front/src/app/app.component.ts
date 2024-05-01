import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppModule } from './app.module';
import { ViewEncapsulation } from '@angular/core';
import { LayoutComponent } from './layouts/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, AppModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  title = 'front';
}

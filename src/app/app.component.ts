import { Component } from '@angular/core'
import { MatToolbarModule } from '@angular/material/toolbar'
import { Title } from '@angular/platform-browser'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule],
})
export class AppComponent {
  constructor(public title: Title) {}
}

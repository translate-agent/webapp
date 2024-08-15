import { Component, EventEmitter, input, Output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { RouterLink } from '@angular/router'
import { ServiceNew } from '../services/services.component'

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [MatListModule, RouterLink, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss',
})
export class ServicesListComponent {
  services = input.required<ServiceNew[]>()
  @Output() delete = new EventEmitter<ServiceNew>()
  @Output() edit = new EventEmitter<ServiceNew>()
  @Output() create = new EventEmitter<string>()

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' })
}

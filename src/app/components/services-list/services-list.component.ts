import { Component, input, output } from '@angular/core'
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
  readonly services = input.required<ServiceNew[]>()

  readonly delete = output<ServiceNew>()
  readonly edit = output<ServiceNew>()
  readonly create = output()
}

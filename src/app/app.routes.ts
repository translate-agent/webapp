import { Routes } from '@angular/router'
import { ServiceComponent } from './components/service/service.component'
import { ServicesComponent } from './components/services/services.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'services',
    pathMatch: 'full',
  },

  {
    path: 'services',
    component: ServicesComponent,
    title: 'Services',
  },
  {
    path: 'services/:id',
    component: ServiceComponent,
  },
  { path: '**', redirectTo: 'services' },
]

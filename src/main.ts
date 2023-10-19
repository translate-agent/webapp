import { importProvidersFrom } from '@angular/core'
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { AppComponent } from './app/app.component'
import { ServiceComponent } from './app/components/service/service.component'
import { ServicesComponent } from './app/components/services/services.component'

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter([
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
    ]),
    provideAnimations(),
  ],
}).catch((err) => console.error(err))

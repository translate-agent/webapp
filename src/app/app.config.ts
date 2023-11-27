import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideAnimations(),
  ],
}

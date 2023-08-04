import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceComponent } from './components/service/service.component';
import { ServicesComponent } from './components/services/services.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesComponent,
  },
  {
    path: 'services',
    component: ServicesComponent,
  },
  {
    path: 'services/:id',
    component: ServiceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

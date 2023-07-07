import { Component } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { TranslateClientService } from 'src/app/services/translate-client.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent {
  readonly serviceList = this.service.listService().pipe(
    map((v) => v.services),
    shareReplay(1)
  );

  constructor(private service: TranslateClientService) {}
}

import { Component, OnInit } from '@angular/core'
import { TranslateClientService } from './services/translate.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'webapp'

  constructor(private service: TranslateClientService) {}

  ngOnInit(): void {
    this.service
      .listService()
      .then((res) => console.log(res.services))
      .catch((err) => console.error(err))
  }
}

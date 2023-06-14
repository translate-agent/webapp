import { Component, OnInit } from '@angular/core'
import { TranslateService } from './services/translate.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'webapp'

  constructor(private service: TranslateService) {}

  ngOnInit(): void {
    console.log()

    this.service.createService()

    // this.service.listService()
  }
}

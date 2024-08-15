import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterModule } from '@angular/router'
import { AppComponent } from './app.component'

describe('AppComponent', () => {
  let app: AppComponent
  let fixture: ComponentFixture<AppComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],
    }).compileComponents()

    fixture = TestBed.createComponent(AppComponent)
    app = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the app', () => {
    expect(app).toBeTruthy()
  })
})

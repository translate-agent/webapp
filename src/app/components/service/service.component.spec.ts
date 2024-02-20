import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RouterTestingModule } from '@angular/router/testing'
import { ServiceComponent } from './service.component'

describe('ServiceComponent', () => {
  let component: ServiceComponent
  let fixture: ComponentFixture<ServiceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceComponent, RouterTestingModule],
    }).compileComponents()

    fixture = TestBed.createComponent(ServiceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

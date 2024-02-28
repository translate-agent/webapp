import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ServicesComponent } from '../services/services.component'
import { CreateServiceComponent } from './create-service.component'

describe('CreateServiceComponent', () => {
  let component: CreateServiceComponent
  let fixture: ComponentFixture<CreateServiceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateServiceComponent,
        ServicesComponent,
        MatDialogModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(CreateServiceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have a form', () => {
    expect(component.form).toBeDefined()
  })

  it('should have a serviceName field', () => {
    expect(component.form.controls['serviceName']).toBeDefined()
  })

  it('should have a confirm method', () => {
    expect(component.confirm).toBeDefined()
  })
})

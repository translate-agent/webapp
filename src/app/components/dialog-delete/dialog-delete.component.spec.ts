import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { By } from '@angular/platform-browser'
import { DialogDeleteComponent } from './dialog-delete.component'

describe('DialogDeleteComponent', () => {
  let component: DialogDeleteComponent
  let fixture: ComponentFixture<DialogDeleteComponent>

  const mockService = { id: '1', name: 'test' }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogDeleteComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockService },
        { provide: MatDialogRef, useValue: {} },
      ],
    })
    fixture = TestBed.createComponent(DialogDeleteComponent)
    component = fixture.componentInstance

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have a service property', () => {
    expect(component.service).toBeDefined()
  })

  it('should display dialog title', () => {
    const debugElement = fixture.debugElement.query(By.css('h3'))

    expect(debugElement.nativeElement.textContent).toContain('Delete service')
  })

  it('should display close icon on button', () => {
    const matIcon = fixture.debugElement.query(By.css('button mat-icon'))

    expect(matIcon).toBeTruthy()
    expect(matIcon.nativeElement.getAttribute('fontIcon')).toBe('close')
  })

  it('should have a button with mat-dialog-close attribute', () => {
    const button = fixture.debugElement.query(By.css('div button[mat-dialog-close]'))

    expect(button).toBeTruthy()
  })

  it('should have two buttons in mat-dialog-actions', () => {
    const buttons = fixture.debugElement.queryAll(By.css('mat-dialog-actions button'))

    expect(buttons.length).toBe(2)
  })
})

import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { DialogDeleteComponent } from './dialog-delete.component'

describe('DialogDeleteComponent', () => {
  let component: DialogDeleteComponent
  let fixture: ComponentFixture<DialogDeleteComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogDeleteComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: [] }],
    })
    fixture = TestBed.createComponent(DialogDeleteComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NewLanguageDialogComponent } from './new-language-dialog.component'

describe('NewLanguageDialogComponent', () => {
  let component: NewLanguageDialogComponent
  let fixture: ComponentFixture<NewLanguageDialogComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewLanguageDialogComponent],
    })
    fixture = TestBed.createComponent(NewLanguageDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatMenuHarness, MatMenuItemHarness } from '@angular/material/menu/testing'
import { By } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { ServiceNew } from '../services/services.component'
import { ServicesListComponent } from './services-list.component'

const testData: ServiceNew[] = [
  { id: '1', name: 'test' },
  { id: '2', name: 'test2' },
]

describe('ServicesListComponent', () => {
  let component: ServicesListComponent
  let fixture: ComponentFixture<ServicesListComponent>
  let loader: HarnessLoader

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ServicesListComponent,
        RouterTestingModule,
        MatMenuModule,
        MatIconModule,
        NoopAnimationsModule,
        MatButtonModule,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ServicesListComponent)
    component = fixture.componentInstance
    loader = TestbedHarnessEnvironment.loader(fixture)
    component.services = testData

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render 2 menu items', async () => {
    const menu = await loader.getHarness(MatMenuHarness.with({ selector: '#menuButton' }))
    await menu.open()

    expect((await menu.getItems()).length).toBe(2)
  })

  describe('input: services', () => {
    it('should display the list of services', () => {
      const services = fixture.debugElement.queryAll(By.css('.serviceList'))

      expect(services.length).toBe(testData.length)
    })

    it('should not render empty message if there are services', () => {
      const emptyMessage = fixture.debugElement.query(By.css('.empty'))

      expect(emptyMessage).toBeFalsy()
    })

    it('should render empty message if there are no services', () => {
      component.services = []

      fixture.detectChanges()

      const emptyMessage = fixture.debugElement.query(By.css('.empty'))
      expect(emptyMessage).toBeTruthy()
    })
  })

  describe('output', () => {
    let menu: MatMenuHarness

    beforeEach(async () => {
      menu = await loader.getHarness(MatMenuHarness.with({ selector: '#menuButton' }))
      await menu.open()
    })

    it('should emit service item to be deleted', async () => {
      spyOn(component.delete, 'emit').and.callThrough()

      const deleteButton = await menu.getHarness(MatMenuItemHarness.with({ selector: '#delete' }))
      await deleteButton.click()

      expect(component.delete.emit).toHaveBeenCalledWith(testData[0])
      expect(component.delete.emit).toHaveBeenCalledTimes(1)
    })

    it('should emit service item to be edited', async () => {
      spyOn(component.edit, 'emit').and.callThrough()

      const editButton = await menu.getHarness(MatMenuItemHarness.with({ selector: '#edit' }))
      await editButton.click()

      expect(component.edit.emit).toHaveBeenCalledWith(testData[0])
      expect(component.edit.emit).toHaveBeenCalledTimes(1)
    })

    it('should emit when create button is clicked', () => {
      component.services = []

      fixture.detectChanges()

      spyOn(component.create, 'emit').and.callThrough()

      const createButton = fixture.debugElement.query(By.css('#create')).nativeElement

      createButton.click()

      expect(component.create.emit).toHaveBeenCalled()
      expect(component.create.emit).toHaveBeenCalledTimes(1)
    })
  })
})

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

describe('ServicesListComponent', () => {
  let component: ServicesListComponent
  let fixture: ComponentFixture<ServicesListComponent>
  let loader: HarnessLoader

  const testData: ServiceNew[] = [
    { id: '1', name: 'test' },
    { id: '2', name: 'test2' },
  ]

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

    it('should not render empty if there are services', () => {
      const emptyMessage = fixture.debugElement.query(By.css('.empty'))

      expect(emptyMessage).toBeFalsy()
    })

    it('should render empty message if there are no services', () => {
      const testData: ServiceNew[] = []
      component.services = testData

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
      const serviceToDelete: ServiceNew = { id: '1', name: 'test' }

      spyOn(component.delete, 'emit').and.callThrough()

      const deleteButton = await menu.getHarness(MatMenuItemHarness.with({ selector: '#delete' }))
      await deleteButton.click()

      expect(component.delete.emit).toHaveBeenCalledWith(serviceToDelete)
      expect(component.delete.emit).toHaveBeenCalledTimes(1)
    })

    it('should emit service item to be edited', async () => {
      const serviceToEdited: ServiceNew = { id: '1', name: 'test' }

      spyOn(component.edit, 'emit').and.callThrough()

      const editButton = await menu.getHarness(MatMenuItemHarness.with({ selector: '#edit' }))
      await editButton.click()

      expect(component.edit.emit).toHaveBeenCalledWith(serviceToEdited)
      expect(component.edit.emit).toHaveBeenCalledTimes(1)
    })
  })
})

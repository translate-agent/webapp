import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DebugElement } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { By, Title } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { ListServicesResponse } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { of } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { CreateServiceComponent } from '../create-service/create-service.component'
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component'
import { ServicesListComponent } from '../services-list/services-list.component'
import { ServiceNew, ServicesComponent } from './services.component'

describe('ServicesComponent', () => {
  let component: ServicesComponent
  let fixture: ComponentFixture<ServicesComponent>
  let title: Title
  let translateClientServiceSpy: jasmine.SpyObj<TranslateClientService>
  // let dialog: MatDialog
  // let snackBar: MatSnackBar

  // let servicesItemList: DebugElement

  const testData: ServiceNew[] = [
    { id: '1', name: 'test' },
    { id: '2', name: 'test2' },
  ]

  const translateClientServiceMock = jasmine.createSpyObj('TranslateClientService', [
    'listServices',
    'deleteService',
    'updateService',
    'createService',
  ])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ServicesComponent,
        RouterTestingModule,
        MatToolbarModule,
        MatIconModule,
        ServicesListComponent,
        DialogDeleteComponent,
        MatDialogModule,
        BrowserAnimationsModule,
      ],
      providers: [
        Title,
        {
          provide: TranslateClientService,
          useValue: translateClientServiceMock,
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ServicesComponent)
    title = TestBed.inject(Title)
    component = fixture.debugElement.componentInstance

    translateClientServiceSpy = TestBed.inject(TranslateClientService) as jasmine.SpyObj<TranslateClientService>

    // servicesItemList = fixture.debugElement.query(By.css('app-services-list'))

    translateClientServiceSpy.listServices.and.returnValue(
      of(
        new ListServicesResponse({
          services: [{ id: 'service-id', name: 'Test Service' }],
        }),
      ),
    )

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it(`should have a button 'New service' to add a service if services list are not empty`, () => {
    const button = fixture.debugElement.query(By.css('.button-add'))

    expect(button).toBeDefined()
    expect(button.nativeElement.classList.contains('hidden')).toBeFalsy()
    expect(button.nativeElement.textContent.trim()).toEqual('New service')
  })

  it(`should call the openCreateServiceModal method and opens a dialog when the 'New service' button is clicked`, async () => {
    const button = fixture.debugElement.query(By.css('.button-add button'))
    spyOn(component, 'createService').and.callThrough()
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(true),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    button.nativeElement.click()
    fixture.detectChanges()
    // component.opencreateServiceModal()
    // component.dialog.open(CreateServiceComponent, { width: '500px' })

    expect(component.createService).toHaveBeenCalled()
    expect(component.dialog.open).toHaveBeenCalled()
    expect(component.dialog.open).toHaveBeenCalledTimes(1)
    expect(component.dialog.open).toHaveBeenCalledWith(CreateServiceComponent, { width: '500px' })
  })

  it(`should not render a button 'New service' if services list are empty `, () => {
    component.services$.set([])

    fixture.detectChanges()

    const button = fixture.debugElement.query(By.css('.button-add'))

    expect(button.nativeElement.classList.contains('hidden')).toBeTruthy()
  })

  it('should display the title from Title service', () => {
    spyOn(title, 'getTitle').and.returnValue('Services')
    fixture.detectChanges()
    const titleElement = fixture.debugElement.query(By.css('.title'))
    expect(titleElement.nativeElement.textContent).toContain('Services')
  })

  it('should have a list of services', () => {
    const list = fixture.debugElement.query(By.css('app-services-list'))
    expect(list).toBeDefined()
  })

  describe('deleteService', () => {
    let serviceListComponent: DebugElement[]

    beforeEach(async () => {
      serviceListComponent = fixture.debugElement.queryAll(By.directive(ServicesListComponent))
      spyOn(component, 'deleteService').and.callThrough()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any)
      translateClientServiceSpy.deleteService.and.returnValue(of())

      serviceListComponent[0].componentInstance.delete.emit(testData[0])
      fixture.detectChanges()
    })

    it('should call the deleteService method and open mat-dialog when delete event is emitted in ServicesListComponent', async () => {
      expect(component.deleteService).toHaveBeenCalled()
      expect(component.deleteService).toHaveBeenCalledWith(testData[0])
      expect(component.deleteService).toHaveBeenCalledTimes(1)
      expect(component.dialog.open).toHaveBeenCalled()
      expect(component.dialog.open).toHaveBeenCalledTimes(1)
      expect(component.dialog.open).toHaveBeenCalledWith(DialogDeleteComponent, {
        data: testData[0],
        width: '500px',
      })
    })
  })

  describe('editService', () => {
    it('open dialog', () => {
      component.editService({ id: '5a379c4f-8611-4bd6-8a34-efb2f29ac625', name: 'superset' })
      fixture.detectChanges()
      const dialog = document.getElementsByTagName('h3')[0]
      expect(dialog).toBeDefined()
    })
  })
})

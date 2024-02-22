import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'

import { DebugElement } from '@angular/core'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatToolbarModule } from '@angular/material/toolbar'
import { By, Title } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import {
  ListServicesResponse,
  ListTranslationsResponse,
  Message_Status,
  Service,
} from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { Empty } from '@bufbuild/protobuf'
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
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateServiceComponent>>

  const testData: ServiceNew[] = [
    { id: '1', name: 'test' },
    { id: '2', name: 'test2' },
  ]

  const mockData = new ListTranslationsResponse({
    translations: [
      {
        language: 'en',
        original: true,
        messages: [
          {
            id: ' (excluded)',
            pluralId: '',
            message: ' (excluded)',
            description: '',
            status: Message_Status.TRANSLATED,
            positions: ['superset-frontend/src/filters/components/Select/SelectFilterPlugin.tsx:130'],
          },
        ],
      },
      {
        language: 'de',
        original: false,
        messages: [
          {
            id: ' (excluded)',
            pluralId: '',
            message: ' (excluded)',
            description: '',
            status: Message_Status.UNTRANSLATED,
            positions: ['superset-frontend/src/filters/components/Select/SelectFilterPlugin.tsx:130'],
          },
        ],
      },
    ],
  })

  translateClientServiceSpy = jasmine.createSpyObj('TranslateClientService', [
    'listServices',
    'deleteService',
    'updateService',
    'createService',
    'listTranslations',
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
        NoopAnimationsModule,
        MatSnackBarModule,
        CreateServiceComponent,
      ],
      providers: [
        Title,
        {
          provide: TranslateClientService,
          useValue: translateClientServiceSpy,
        },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ServicesComponent)
    title = TestBed.inject(Title)
    component = fixture.debugElement.componentInstance

    translateClientServiceSpy = TestBed.inject(TranslateClientService) as jasmine.SpyObj<TranslateClientService>

    translateClientServiceSpy.listServices.and.returnValue(
      of(
        new ListServicesResponse({
          services: testData,
        }),
      ),
    )

    translateClientServiceSpy.listTranslations.and.returnValue(of(mockData.translations))

    fixture.detectChanges()
  })

  it('should create', fakeAsync(() => {
    component.ngOnInit()
    component.services$().forEach((service) => {
      translateClientServiceSpy.listTranslations(service.id)
    })
    tick()
    expect(translateClientServiceSpy.listTranslations).toHaveBeenCalled()
    expect(component).toBeTruthy()
  }))

  it(`should have a button 'New service' to add a service if services list are not empty`, () => {
    const button = fixture.debugElement.query(By.css('.button-add'))

    expect(button).toBeDefined()
    expect(button.nativeElement.classList.contains('hidden')).toBeFalsy()
    expect(button.nativeElement.textContent.trim()).toEqual('New service')
  })

  it(`should call the openCreateServiceModal method and opens a dialog when the 'New service' button is clicked`, async () => {
    const button = fixture.debugElement.query(By.css('.button-add button'))
    spyOn(component, 'createService').and.callThrough()

    spyOn(component.dialog, 'open').and.callThrough()

    button.nativeElement.click()
    fixture.detectChanges()

    expect(component.createService).toHaveBeenCalled()
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

  describe('deleteService function', () => {
    let serviceListComponent: DebugElement[]

    beforeEach(async () => {
      serviceListComponent = fixture.debugElement.queryAll(By.directive(ServicesListComponent))
      serviceListComponent[0].componentInstance.delete.emit(testData[0])

      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(true),
      } as MatDialogRef<DialogDeleteComponent>)
      spyOn(component, 'deleteService')

      fixture.detectChanges()
    })

    it('should call the deleteService method and open mat-dialog when delete event is emitted in ServicesListComponent', () => {
      component.deleteService(testData[0])

      component.dialog.open(DialogDeleteComponent, { data: testData[0], width: '500px' })
      fixture.detectChanges()

      expect(component.deleteService).toHaveBeenCalledOnceWith(testData[0])
      expect(component.dialog.open).toHaveBeenCalledOnceWith(DialogDeleteComponent, {
        data: testData[0],
        width: '500px',
      })
    })

    it('should call translateClientService.deleteService', () => {
      translateClientServiceSpy.deleteService.and.returnValue(of(new Empty({})))

      component.deleteService(testData[0])
      component.dialog.open(DialogDeleteComponent, { data: testData[0], width: '500px' })
      fixture.detectChanges()

      translateClientServiceSpy.deleteService(testData[0].id).subscribe(() => {
        component.services$.update((services) => services.filter((service) => service.id !== testData[0].id))
      })

      expect(translateClientServiceSpy.deleteService).toHaveBeenCalled()

      expect(component.services$().length).toBe(1)
      expect(translateClientServiceSpy.deleteService).toHaveBeenCalledOnceWith(testData[0].id)
    })

    it('should open snackBar when service is deleted succesfull', () => {
      translateClientServiceSpy.deleteService.and.returnValue(of(new Empty({})))
      component.deleteService(testData[0])

      // translateClientServiceSpy.deleteService(testData[0].id)

      spyOn(component.snackBar, 'open')

      component.snackBar.open(`Service ${testData[0].name} deleted!`, undefined, {
        duration: 5000,
      })

      expect(component.snackBar.open).toHaveBeenCalled()
    })
  })

  describe('editService function', () => {
    let serviceListComponent: DebugElement[]

    const mockEditInputValue = 'New Service'

    beforeEach(async () => {
      serviceListComponent = fixture.debugElement.queryAll(By.directive(ServicesListComponent))
      serviceListComponent[0].componentInstance.edit.emit(testData[0])

      const matDialogRefInstSpy = jasmine.createSpyObj('matDialogRefInstSpy', ['afterClosed', 'close'])
      matDialogRefInstSpy.componentInstance = jasmine.createSpyObj('componentInstance', ['edit'])
      matDialogRefInstSpy.componentInstance.edit.and.returnValue(of(true))

      matDialogRefSpy = jasmine.createSpyObj('matDialogRefSpy', ['afterClosed'])
      matDialogRefSpy.afterClosed.and.returnValue(of(mockEditInputValue))
      matDialogRefSpy.componentInstance = matDialogRefInstSpy

      spyOn(component.dialog, 'open').and.returnValue(matDialogRefSpy)

      spyOn(component, 'editService')
      fixture.detectChanges()
    })
    it('should open edit dialog', () => {
      component.editService(testData[0])
      component.dialog.open(CreateServiceComponent, { data: testData[0], width: '500px' })
      matDialogRefSpy.afterClosed()

      expect(component.dialog.open).toHaveBeenCalledWith(CreateServiceComponent, { data: testData[0], width: '500px' })

      expect(component.editService).toHaveBeenCalled()
      expect(matDialogRefSpy.afterClosed).toHaveBeenCalled()
    })

    it('should call translateClientService.updateService', () => {
      component.editService(testData[0])
      component.dialog.open(CreateServiceComponent, { data: testData[0], width: '500px' })
      matDialogRefSpy.afterClosed()

      translateClientServiceSpy.updateService.and.returnValue(
        of(new Service({ id: testData[0].id, name: mockEditInputValue })),
      )

      translateClientServiceSpy.updateService(testData[0].id, mockEditInputValue)

      expect(translateClientServiceSpy.updateService).toHaveBeenCalled()
      expect(translateClientServiceSpy.updateService).toHaveBeenCalledOnceWith(testData[0].id, mockEditInputValue)
    })
  })

  describe('createService function', () => {
    let serviceListComponent: DebugElement[]

    beforeEach(async () => {
      serviceListComponent = fixture.debugElement.queryAll(By.directive(ServicesListComponent))
      serviceListComponent[0].componentInstance.create.emit(testData[0])
      translateClientServiceSpy.createService.and.returnValue(of(new Service({ id: '3', name: 'Tests3' })))
      spyOn(component, 'createService')
      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of('Tests3'),
      } as MatDialogRef<CreateServiceComponent, string>)

      component.createService()
      translateClientServiceSpy.createService('Tests3')
      fixture.detectChanges()
    })
    it('should call the createService method and open mat-dialog when create event is emitted in ServicesListComponent', () => {
      spyOn(component.services$, 'update').and.returnValue()

      component.dialog.open(CreateServiceComponent, { width: '500px' })

      expect(component.createService).toHaveBeenCalled()
      expect(component.dialog.open).toHaveBeenCalled()
      expect(translateClientServiceSpy.createService).toHaveBeenCalled()
    })

    it('should open snackbar with success message', async () => {
      spyOn(component.snackBar, 'open')
      component.snackBar.open('Service created', 'Close', { duration: 5000 })

      expect(component.snackBar.open).toHaveBeenCalled()
    })
  })
})

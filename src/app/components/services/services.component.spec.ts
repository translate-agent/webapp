import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'

import { DebugElement } from '@angular/core'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatToolbarModule } from '@angular/material/toolbar'
import { By, Title } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { ListServicesResponse, Service } from '@buf/expect_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { Empty } from '@bufbuild/protobuf'
import { of, throwError } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { mockListTranslationsResponse } from 'src/app/services/translate-client.service.spec'
import { CreateServiceComponent } from '../create-service/create-service.component'
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component'
import { ServicesListComponent } from '../services-list/services-list.component'
import { ServiceNew, ServicesComponent } from './services.component'

export const mockServices: ServiceNew[] = [
  { id: '1', name: 'test' },
  { id: '2', name: 'test2' },
]

export const spy = jasmine.createSpyObj('TranslateClientService', [
  'listServices',
  'deleteService',
  'updateService',
  'createService',
  'listTranslations',
  'getService',
  'createTranslation',
  'updateTranslation',
  'uploadTranslationFile',
  'downloadTranslationFile',
])

describe('ServicesComponent', () => {
  let component: ServicesComponent
  let fixture: ComponentFixture<ServicesComponent>
  let title: Title
  let translateClientServiceSpy: jasmine.SpyObj<TranslateClientService>
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateServiceComponent>>

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
          useValue: spy,
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
          services: mockServices,
        }),
      ),
    )

    translateClientServiceSpy.listTranslations.and.returnValue(of(mockListTranslationsResponse.translations))

    fixture.detectChanges()
  })

  it('should create', fakeAsync(() => {
    component.services().forEach((service) => {
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

  it(`should call the openCreateServiceModal method and opens a dialog when the 'New service' button is clicked`, () => {
    const button = fixture.debugElement.query(By.css('.button-add button'))
    spyOn(component, 'createService').and.callThrough()

    button.nativeElement.click()
    fixture.detectChanges()

    expect(component.createService).toHaveBeenCalled()
  })

  it(`should not render a button 'New service' if services list are empty `, () => {
    component.services.set([])

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
      serviceListComponent[0].componentInstance.delete.emit(mockServices[0])

      translateClientServiceSpy.deleteService.and.returnValue(of(new Empty({})))

      spyOn(component, 'deleteService').and.callThrough()

      component.deleteService(mockServices[0])

      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(true),
      } as MatDialogRef<DialogDeleteComponent>)

      component.deleteService(mockServices[0])
      fixture.detectChanges()
    })

    it('should call the deleteService method and open mat-dialog when delete event is emitted in ServicesListComponent', () => {
      component.dialog.open(DialogDeleteComponent, { data: mockServices[0], width: '500px' })

      expect(component.deleteService).toHaveBeenCalledWith(mockServices[0])
      expect(component.dialog.open).toHaveBeenCalledWith(DialogDeleteComponent, {
        data: mockServices[0],
        width: '500px',
      })
    })

    it('should call translateClientService.deleteService', () => {
      component.dialog.open(DialogDeleteComponent, { data: mockServices[0], width: '500px' })

      translateClientServiceSpy.deleteService(mockServices[0].id).subscribe(() => {
        component.services.update((services) => services.filter((service) => service.id !== mockServices[0].id))
      })

      expect(translateClientServiceSpy.deleteService).toHaveBeenCalled()

      expect(component.services().length).toBe(1)
      expect(translateClientServiceSpy.deleteService).toHaveBeenCalledWith(mockServices[0].id)
    })

    it('should open snackBar when service is deleted succesfull', () => {
      spyOn(component.snackBar, 'open')

      component.snackBar.open(`Service ${mockServices[0].name} deleted!`, undefined, {
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
      serviceListComponent[0].componentInstance.edit.emit(mockServices[0])

      const matDialogRefInstSpy = jasmine.createSpyObj('matDialogRefInstSpy', ['afterClosed', 'close'])
      matDialogRefInstSpy.componentInstance = jasmine.createSpyObj('componentInstance', ['edit'])
      matDialogRefInstSpy.componentInstance.edit.and.returnValue(of(true))

      matDialogRefSpy = jasmine.createSpyObj('matDialogRefSpy', ['afterClosed'])
      matDialogRefSpy.afterClosed.and.returnValue(of(mockEditInputValue))
      matDialogRefSpy.componentInstance = matDialogRefInstSpy

      translateClientServiceSpy.updateService.and.returnValue(
        of(new Service({ id: mockServices[0].id, name: mockEditInputValue })),
      )

      spyOn(component.dialog, 'open').and.returnValue(matDialogRefSpy)

      spyOn(component, 'editService').and.callThrough()
      fixture.detectChanges()
    })
    it('should open and close edit dialog', () => {
      component.editService(mockServices[0])
      component.dialog.open(CreateServiceComponent, { data: mockServices[0], width: '500px' })
      matDialogRefSpy.afterClosed()

      expect(component.dialog.open).toHaveBeenCalledWith(CreateServiceComponent, {
        data: mockServices[0],
        width: '500px',
      })

      expect(component.editService).toHaveBeenCalled()
      expect(matDialogRefSpy.afterClosed).toHaveBeenCalled()
    })

    it('should call translateClientService.updateService', () => {
      component.editService(mockServices[0])
      component.dialog.open(CreateServiceComponent, { data: mockServices[0], width: '500px' })
      matDialogRefSpy.afterClosed()

      translateClientServiceSpy.updateService(mockServices[0].id, mockEditInputValue)

      expect(translateClientServiceSpy.updateService).toHaveBeenCalled()
      expect(translateClientServiceSpy.updateService).toHaveBeenCalledWith(mockServices[0].id, mockEditInputValue)
    })
  })

  describe('createService function', () => {
    let serviceListComponent: DebugElement[]

    beforeEach(async () => {
      serviceListComponent = fixture.debugElement.queryAll(By.directive(ServicesListComponent))
      serviceListComponent[0].componentInstance.create.emit(mockServices[0])

      translateClientServiceSpy.createService.and.returnValue(of(new Service({ id: '3', name: 'Tests3' })))

      spyOn(component, 'createService').and.callThrough()

      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of('Tests3'),
      } as MatDialogRef<CreateServiceComponent>)

      fixture.detectChanges()
    })
    it('should call the createService method and open mat-dialog when create event is emitted in ServicesListComponent', () => {
      component.createService()
      translateClientServiceSpy.createService.and
        .returnValue(of(new Service({ id: '3', name: 'Tests3' })))
        .and.callThrough()
      component.dialog.open(CreateServiceComponent, { width: '500px' })
      fixture.detectChanges()
      expect(component.createService).toHaveBeenCalled()
      expect(component.dialog.open).toHaveBeenCalled()
    })

    it('should call service.createService method', () => {
      translateClientServiceSpy.createService.and
        .returnValue(of(new Service({ id: '3', name: 'Tests3' })))
        .and.callThrough()
      translateClientServiceSpy.createService('Tests3')

      expect(translateClientServiceSpy.createService).toHaveBeenCalled()
    })

    it('should open snackbar with success message', async () => {
      translateClientServiceSpy.createService.and
        .returnValue(of(new Service({ id: '3', name: 'Tests3' })))
        .and.callThrough()
      spyOn(component.snackBar, 'open')
      component.snackBar.open('Service created', undefined, { duration: 5000 })

      expect(component.snackBar.open).toHaveBeenCalled()
    })

    it('should update services$ with new value', () => {
      spyOn(component.services, 'update')
        .withArgs((services: ServiceNew[]) => [...services, { id: '3', name: 'Tests3' }])
        .and.returnValue()
        .and.callThrough()
      component.services.update((services: ServiceNew[]) => [...services, { id: '3', name: 'Tests3' }])

      expect(component.services.update).toHaveBeenCalledTimes(1)
      expect(component.services().length).toBe(3)
    })
  })

  describe('error', () => {
    let serviceListComponent: DebugElement[]
    const error = 'An error occurred'

    beforeEach(async () => {
      serviceListComponent = fixture.debugElement.queryAll(By.directive(ServicesListComponent))
      serviceListComponent[0].componentInstance.create.emit(mockServices[0])

      translateClientServiceSpy.createService.and.returnValue(throwError(() => error))

      translateClientServiceSpy.deleteService.and.returnValue(throwError(() => error))
      translateClientServiceSpy.updateService.and.returnValue(throwError(() => error))

      fixture.detectChanges()
    })

    it('should return error when createService fails and open snackbar with error message', () => {
      spyOn(component.snackBar, 'open')
      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of('Tests3'),
      } as MatDialogRef<CreateServiceComponent>)

      component.createService()

      translateClientServiceSpy.createService('Tests3').subscribe({
        error: (err) => {
          component.snackBar.open(error, undefined, { duration: 5000 })
          expect(err).toEqual(error)
          expect(component.snackBar.open).toHaveBeenCalledWith(error, undefined, {
            duration: 5000,
          })
        },
      })
    })

    it('should return error when deleteservice fails', () => {
      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(true),
      } as MatDialogRef<DialogDeleteComponent>)

      spyOn(component.snackBar, 'open')

      component.deleteService(mockServices[0])

      translateClientServiceSpy.deleteService(mockServices[0].id).subscribe({
        error: (err) => {
          component.snackBar.open(error, undefined, { duration: 5000 })
          expect(err).toEqual(error)
          expect(component.snackBar.open).toHaveBeenCalledWith(error, undefined, {
            duration: 5000,
          })
        },
      })
    })

    it('should return error when updateService fails', () => {
      const mockEditInputValue = 'New Service'

      const matDialogRefInstSpy = jasmine.createSpyObj('matDialogRefInstSpy', ['afterClosed', 'close'])
      matDialogRefInstSpy.componentInstance = jasmine.createSpyObj('componentInstance', ['edit'])
      matDialogRefInstSpy.componentInstance.edit.and.returnValue(of(true))

      matDialogRefSpy = jasmine.createSpyObj('matDialogRefSpy', ['afterClosed'])
      matDialogRefSpy.afterClosed.and.returnValue(of(mockEditInputValue))
      matDialogRefSpy.componentInstance = matDialogRefInstSpy

      spyOn(component.dialog, 'open').and.returnValue(matDialogRefSpy)

      spyOn(component.snackBar, 'open')

      component.editService(mockServices[0])

      translateClientServiceSpy.updateService(mockServices[0].id, mockEditInputValue).subscribe({
        error: (err) => {
          component.snackBar.open(error, undefined, { duration: 5000 })
          expect(err).toEqual(error)
          expect(component.snackBar.open).toHaveBeenCalledWith(error, undefined, {
            duration: 5000,
          })
        },
      })
    })
  })
})

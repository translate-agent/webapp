import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { TextFieldModule } from '@angular/cdk/text-field'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'

import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { CreateServiceComponent } from './components/create-service/create-service.component'
import { ServiceComponent } from './components/service/service.component'
import { ServicesComponent } from './components/services/services.component'
import { UploadTranslationFileComponent } from './components/upload-translation-file/upload-translation-file.component'

@NgModule({
  declarations: [
    AppComponent,
    ServicesComponent,
    UploadTranslationFileComponent,
    CreateServiceComponent,
    ServiceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDividerModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    TextFieldModule,
    ReactiveFormsModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

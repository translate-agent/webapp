import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Schema } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb';
import { map, shareReplay } from 'rxjs';
import { TranslateClientService } from 'src/app/services/translate-client.service';

const schemas = {
  UNSPECIFIED: Schema.UNSPECIFIED,
  JSON_NG_LOCALIZE: Schema.JSON_NG_LOCALIZE,
  JSON_NGX_TRANSLATE: Schema.JSON_NGX_TRANSLATE,
  GO: Schema.GO,
  ARB: Schema.ARB,
  POT: Schema.POT,
  XLIFF_12: Schema.XLIFF_12,
  XLIFF_2: Schema.XLIFF_2,
};

@Component({
  selector: 'app-upload-translation-file',
  templateUrl: './upload-translation-file.component.html',
  styleUrls: ['./upload-translation-file.component.scss'],
})
export class UploadTranslationFileComponent implements OnInit {
  readonly form = this.fb.nonNullable.group({
    language: '',
    schema: Schema.UNSPECIFIED,
    serviceId: '',
    original: false,
    populateTranslations: false,
  });

  readonly serviceList = this.service.listService().pipe(
    map((v) => v.services),
    shareReplay(1)
  );

  file!: File;

  readonly schema = schemas;

  constructor(
    private fb: FormBuilder,
    private service: TranslateClientService
  ) {}

  ngOnInit(): void {
    console.log();
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    this.file = inputElement.files![0];
  }

  async upload() {
    const { language, schema, serviceId, original, populateTranslations } =
      this.form.getRawValue();

    const buffer = await this.file.arrayBuffer();

    const newData = new Uint8Array(buffer);

    this.service
      .uploadTranslationFile(
        newData,
        language,
        schema,
        original,
        serviceId,
        populateTranslations
      )
      .subscribe({
        next: (v) => console.log(v),
        error: (err) => console.log(err),
      });
  }
}

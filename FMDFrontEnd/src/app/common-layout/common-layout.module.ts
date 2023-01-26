import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { UploadFileComponent } from './_components/upload-file/upload-file.component';
import { WizardTabsComponent } from './_components/wizard-tabs/wizard-tabs.component';


@NgModule({
  declarations: [
    UploadFileComponent,
    WizardTabsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyACwVlDNUZg6o866cbKI2roPfsED1xy8IU',
      libraries: ['places']
    }),
    NgbToastModule
  ],
  exports: [
    UploadFileComponent,
    WizardTabsComponent
  ]
})
export class CommonLayoutModule { }

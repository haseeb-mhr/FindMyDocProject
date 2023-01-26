import { TemplateRef } from '@angular/core';

export class ToastNotification {
  id: string;
  body: string | TemplateRef<any>;
  className: string;
}

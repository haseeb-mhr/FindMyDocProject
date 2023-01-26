import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastNotification } from 'src/app/_models/toast-notification.model';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.sass']
})
export class ToastNotificationComponent implements OnInit {

  toastDelay = environment.admin.toast_delay;

  constructor(public notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  isTemplate(toast: ToastNotification) {
    return toast.body instanceof TemplateRef;
  }
}
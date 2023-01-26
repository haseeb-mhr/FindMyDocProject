import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetNotification } from '../_interfaces/get-notification';
import { NotificationResponse } from '../_models/notification-response.model';
import { NotificationStatus } from '../_models/enums/notification-status.model';
import { NotificationStyle } from '../_models/enums/notification-style.model';
import { ToastNotification } from '../_models/toast-notification.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements GetNotification {
    panelDisplayStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
    toasts: ToastNotification[] = [];
    notificationCount = 0;
    notificationCountSubject = new BehaviorSubject<number>(0);
  
    constructor(private http: HttpService) {
      this.notificationCountSubject.subscribe(count => {
        this.notificationCount = count;
      });
    }
  
    readNotification(notifications: NotificationResponse[]): Observable<any> {
      return this.http.put(environment.api.routes.read_notifications, notifications.filter(x => !x.isRead).map( x => x.id));
    }
    dismissAll(notifications: NotificationResponse[]): Observable<any> {
      return this.http.put(environment.api.routes.dismiss_notifications, notifications
        .filter(x => x.status === 'completed' || x.status === 'failed').map( x => x.id));
    }
    createSimpleNotification(id: string, header: string, body: string, style: NotificationStyle) {
      // TODO: Add code for notification in notification
    }
  
    createProgressNotification(id: string, header: string, body: string, status: NotificationStatus) {
      switch (status) {
        case NotificationStatus.started:
        break;
        case NotificationStatus.inprogress:
        break;
        case NotificationStatus.ended:
        break;
        case NotificationStatus.failure:
        break;
      }
    }
  
    createToastNotification(id: string, body: string | TemplateRef<any>, style: NotificationStyle) {
      this.removeToastNotification(id);
      switch (style) {
        case NotificationStyle.success:
          this.toasts.push({
            id,
            body,
            className: 'bg-success text-light'
          });
          break;
        case NotificationStyle.warning:
          this.toasts.push({
            id,
            body,
            className: 'bg-warning text-dark'
          });
          break;
        case NotificationStyle.danger:
          this.toasts.push({
            id,
            body,
            className: 'bg-danger text-light'
          });
          break;
        case NotificationStyle.info:
          this.toasts.push({
            id,
            body,
            className: 'bg-info text-light'
          });
          break;
      }
    }
  
    createorUpdateToastNotification(id: string, body: string | TemplateRef<any>, style: NotificationStyle) {
      const createdToast = this.toasts.filter(toast => toast.id === id)[0];
      if (!createdToast) {
        this.createToastNotification(id, body, style);
        return;
      }
      const existingToast = this.toasts.filter(toast => toast.id === id)[0];
      existingToast.body = body;
      switch (style) {
        case NotificationStyle.success:
          existingToast.className = 'bg-success text-light';
          break;
        case NotificationStyle.warning:
          existingToast.className = 'bg-warning text-dark';
          break;
        case NotificationStyle.danger:
          existingToast.className = 'bg-danger text-light';
          break;
      }
      this.toasts = this.toasts.filter(toast => toast.id !== id);
      setTimeout(() => {this.toasts.push(existingToast); }, 1);
    }
  
    remove(toast: ToastNotification) {
      this.toasts = this.toasts.filter(t => t.id !== toast.id);
    }
  
    removeToastNotification(id: string) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }
  
    // implementations
    getNotifications(): Observable<NotificationResponse[]> {
      return this.http.get(environment.api.routes.get_notifications);
    }
  }
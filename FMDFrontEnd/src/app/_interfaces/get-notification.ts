import { Observable } from "rxjs";
import { NotificationResponse } from "../_models/notification-response.model";

export interface GetNotification {
    getNotifications(): Observable<NotificationResponse[]>;
}

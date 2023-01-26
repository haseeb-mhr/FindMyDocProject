import { Component, OnInit } from '@angular/core';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { UserRoles } from 'src/app/_models/enums/user-roles.model';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-doctor-register',
  templateUrl: './doctor-register.component.html',
  styleUrls: ['./doctor-register.component.sass']
})
export class DoctorRegisterComponent implements OnInit {

  userRole = UserRoles.Doctor;
  constructor(
    private notificationSvc: NotificationService,
  ) { }

  ngOnInit() {
    this.wizardTabs.push('Edit Account');
    this.wizardTabs.push('Practice Location');
    this.wizardTabs.push('Edit Qualification');
    this.wizardTabs.push('Edit Specialization');
  }

  OnWizardTabChange(tabIndex) {
    if (this.wizardTabs[tabIndex] == 'Register'
      // && !this.subscriptionCreateSvc.purchaseAcceptanceCheck
    ) {
      this.notificationSvc.createorUpdateToastNotification('noAgreedtoSubscriptionCost',
        `Please agree to Subscription Cost.`, NotificationStyle.warning);
      return;
    }
    else
      this.tabIndex = tabIndex;
  }


  buttonClicked(event)
  {
    if(event == 'Next')
      this.tabIndex ++;
      if(event == 'Previous')
      this.tabIndex --;
  }
  tabIndex = 0;
  wizardTabs = [];
}
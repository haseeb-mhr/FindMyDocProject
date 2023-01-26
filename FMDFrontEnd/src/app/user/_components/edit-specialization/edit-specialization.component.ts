import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorSpecialization } from 'src/app/_models/back-end/doctor-specialization.model';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { UserRoles } from 'src/app/_models/enums/user-roles.model';
import { ApplicationService } from 'src/app/_services/application.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-edit-specialization',
  templateUrl: './edit-specialization.component.html',
  styleUrls: ['./edit-specialization.component.sass']
})
export class EditSpecializationComponent implements OnInit {

  @Input() userRole = UserRoles.User;
  @Output() buttonClicked = new EventEmitter<any>();
  form: FormGroup;
  userId : number;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private applicationSvc: ApplicationService,
    private userSvc: UserService,
    private notificationSvc: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  NextButton()
    {
        if(this.userRole == UserRoles.Doctor)
            return true;
        else
            return false;
    }

    OnButtonClick(event)
    {
        this.buttonClicked.emit(event);
    }

  ngOnInit() {
    this.form = this.formBuilder.group({
      specialization: ['', Validators.required],
      experience: ['', Validators.required],
      additonalDetails: ['']
    });

    this.applicationSvc.user.subscribe(user => {
      if (user) {
        this.userId = user.id;
      }
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    let req = new DoctorSpecialization();
  
    req.doctorId = this.userId;
    req.specialization = this.f.specialization.value;
    req.experience = this.f.experience.value;
    req.additonalDetails =  this.f.additonalDetails.value;
  }
}
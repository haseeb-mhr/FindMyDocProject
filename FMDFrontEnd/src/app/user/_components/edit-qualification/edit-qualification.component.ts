import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorQualification } from 'src/app/_models/back-end/doctor-qualification.model';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { UserRoles } from 'src/app/_models/enums/user-roles.model';
import { ApplicationService } from 'src/app/_services/application.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-edit-qualification',
  templateUrl: './edit-qualification.component.html',
  styleUrls: ['./edit-qualification.component.sass']
})
export class EditQualificationComponent implements OnInit {

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
      qualification: ['', Validators.required],
      schoolName: ['', Validators.required],
      schoolingPlace: ['', Validators.required],
      obtainedMarks: ['', Validators.required],
      startingDate: ['', Validators.required],
      endingDate: ['', Validators.required],
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
    let req = new DoctorQualification();
  
    req.doctorId = this.userId;
    req.qualification = this.f.qualification.value;
    req.schoolName = this.f.schoolName.value;
    req.schoolingPlace = this.f.schoolingPlace.value;
    req.obtainedMarks = this.f.obtainedMarks.value;
    req.startingDate = this.f.startingDate.value;
    req.endingDate =  this.f.endingDate.value;
    req.additonalDetails =  this.f.additonalDetails.value;

    this.userSvc.updateQualification(req).subscribe(response => {
      if (response) {
        this.loading = false;
      }
    },
      error => console.log(error)
    );
  }
}
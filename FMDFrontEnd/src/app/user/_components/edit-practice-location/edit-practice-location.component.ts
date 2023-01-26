import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorLocation } from 'src/app/_models/back-end/doctor-location.model';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { UserRoles } from 'src/app/_models/enums/user-roles.model';
import { ApplicationService } from 'src/app/_services/application.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-edit-practice-location',
  templateUrl: './edit-practice-location.component.html',
  styleUrls: ['./edit-practice-location.component.sass']
})
export class EditPracticeLocationComponent implements OnInit {

  @Input() userRole = UserRoles.User;
  @Output() buttonClicked = new EventEmitter<any>();
  form: FormGroup;
  userId : number;
  loading = false;
  submitted = false;
  showMap = false;
  latitude = 0;
  longitude = 0;
  zoom = 17;

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
      locationName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern("^03[0-9]{2} ?[0-9]{7}$")]],
      city: ['', Validators.required],
      consulationFee: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      address: ['', Validators.required],
      openingTime: ['', Validators.required],
      closingTime: ['', Validators.required]
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
    let req = new DoctorLocation();
  
    req.doctorId = this.userId;
    req.address = this.f.address.value;
    req.locationX = this.f.latitude.value;
    req.locationY = this.f.longitude.value;
    req.OpeningTime = this.f.openingTime.value;
    req.ClosingTime = this.f.closingTime.value;
    req.fee =  this.f.consulationFee.value;
    this.userSvc.updatePracticeLocation(req).subscribe(response => {
      if (response) {
        this.loading = false;
      }
    },
      error => console.log(error)
    );
  }

  getCurrentLocation({ 'address': address, 'latitude': latitude, 'longitude': longitude }) {
    this.f.address.setValue(address);
    this.f.latitude.setValue(latitude);
    this.f.longitude.setValue(longitude);
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
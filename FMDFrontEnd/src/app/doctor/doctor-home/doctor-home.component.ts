import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/_models/back-end/doctor.model';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';
import { DoctorService } from '../_services/doctor.service';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.component.html',
  styleUrls: ['./doctor-home.component.sass']
})
export class DoctorHomeComponent implements OnInit {

  form: FormGroup;
  doctors: Doctor[];
  PhotoFilePath = environment.api.photo_access_url;
  selectedStationBoundries = new Map<string, string>();
  doctorSpecialities: string[];

  constructor(
    private reportSvc: DoctorService,
    private notificationSvc: NotificationService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.setDoctorSpecialities();

    this.form = this.formBuilder.group({
      doctorSpeciality: [this.doctorSpecialities[0]]
    });

    this.reportSvc.getAllDoctors().subscribe(doctorsList => {
      if (doctorsList.length > 0) {
        this.doctors = doctorsList;
      }
      else {
        this.notificationSvc.createToastNotification('subscription',
          "We don't have any registered Doctor Data...",
          NotificationStyle.warning);
      }
    },
      error => console.log(error)
    );

  }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }


  onSubmit() {
    var doctorSpeciality = this.f.doctorSpeciality.value;

    this.doctors = this.doctors.filter( d => d.doctorSpecializations.find( s => s.specialization == doctorSpeciality));
  }

  setDoctorSpecialities() {
    this.doctorSpecialities = [
      "Gynecologist",
      "Obstetrician",
      "Gynecology",
      "ynecologist",
      "Fertility Consultant",
      "Gastroenterologist",
      "Dermatologist",
      "Laser Specialist",
      "Cosmetologist",
      "Internal Medicine Specialist",
      "General Physician",
      "Family Physician",
      "Pediatrician",
      "Neonatologist",
      "Neurologist",
      "Orthopedic Surgeon",
      "Pain Management Specialist",
      "Diabetologist",
      "Rheumatologist",
      "Endocrinologist",
      "ENT Specialist",
      "ENT Surgeon",
      "Cardiologist",
      "Consultant Physician",
      "Interventional Cardiologist",
      "Pulmonologist",
      "Critical Care Physician",
      "Eye Surgeon",
      "Eye Specialist",
      "Vitreo Retina Surgeon",
      "Psychiatrist",
      "Urologist",
      "Sexologist",
      "Andrologist",
      "Dentist",
      "Endodontist",
      "Implantologist",
      "Oral and Maxillofacial Surgeon",
      "Programming"
    ];
  }
}
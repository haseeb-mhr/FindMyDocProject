import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './common-layout/_components/navbar/navbar.component';
import { ToastNotificationComponent } from './common-layout/_components/toast-notification/toast-notification.component';
import { ImageSliderComponent } from './dashboard/image-slider/image-slider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './dashboard/footer/footer.component';
import { ContactUsComponent } from './common-layout/_components/contact-us/contact-us.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DoctorCardComponent } from './dashboard/doctor-card/doctor-card.component';
import { DoctorModule } from './doctor/doctor.module';
import { FindMyDoctorComponent } from './find-my-doctor/find-my-doctor.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ToastNotificationComponent,
    ImageSliderComponent,
    FooterComponent,
    ContactUsComponent,
    DashboardComponent,
    DoctorCardComponent,
    FindMyDoctorComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    DoctorModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

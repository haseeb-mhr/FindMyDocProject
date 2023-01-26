import { Component, OnInit } from '@angular/core';
import { DoctorCards } from '../_models/back-end/doctor_card.model';

@Component({
  selector: 'app-find-my-doctor',
  templateUrl: './find-my-doctor.component.html',
  styleUrls: ['./find-my-doctor.component.sass']
})
export class FindMyDoctorComponent implements OnInit {

  doctorImages : string[];
  doctorSpecialities : string[];
  doctorExperiences : string[];

  constructor() { }

  ngOnInit(): void {
    this.SetDoctorCards();
  }

  FindDoctor() {
    this.doctorExperiences = this.doctorExperiences.filter( x => x ==  "7 Years");
  }

  SetDoctorCards() {
    this.doctorImages = [
      "assets/doctor1.jpg",
      "assets/doctor2.jpg",
      "assets/doctor3.jpg",
      "assets/doctor4.jpg",
      "https://images.unsplash.com/photo-1532781914607-2031eca2f00d?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjMyMDc0fQ&amp;s=7c625ea379640da3ef2e24f20df7ce8d",
      "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjMyMDc0fQ&amp;s=42b2d9ae6feb9c4ff98b9133addfb698",
      "https://images.unsplash.com/photo-1532777946373-b6783242f211?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjMyMDc0fQ&amp;s=8ac55cf3a68785643998730839663129",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjMyMDc0fQ&amp;s=ee8417f0ea2a50d53a12665820b54e23",
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjMyMDc0fQ&amp;s=3d2e8a2039c06dd26db977fe6ac6186a",
      "https://images.unsplash.com/photo-1532771098148-525cefe10c23?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjMyMDc0fQ&amp;s=3f317c1f7a16116dec454fbc267dd8e4",
      "https://images.unsplash.com/photo-1532715088550-62f09305f765?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjMyMDc0fQ&amp;s=ebadb044b374504ef8e81bdec4d0e840",
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjMyMDc0fQ&amp;s=0754ab085804ae8a3b562548e6b4aa2e"
    ];

    this.doctorSpecialities = [ 
      "Gynecologist",
      "Obstetrician",
      "Obstetrics",
      "Gynecology",
      "Fertility",
      "Gastroenterologist",
      "Dermatologist",
      "Family Physician",
      "Gynecologist",
      "Cosmetologist",
      "Internal Medicine Specialist",
      "Fertility"
    ];

    this.doctorExperiences = [ 
      "27 Years",
      "10 Years",
      "4 Years",
      "8 Years",
      "9 Years",
      "13 Years",
      "18 Years",
      "20 Years",
      "1 Years",
      "7 Years",
      "9 Years",
      "4 Years"
      ];

  }

}
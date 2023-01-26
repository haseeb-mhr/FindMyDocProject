import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-map-loader',
  templateUrl: './map-loader.component.html',
  styleUrls: ['./map-loader.component.sass']
})
export class MapLoaderComponent implements OnInit {

  @Output() locationEmitter =  new EventEmitter<any>(); 
  latitude = 51.678418;
  longitude = 7.809007;
  zoom = 16;
  address: string;
  private geoCoder;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLoocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();

          this.getAddress(this.latitude, this.longitude);
        });
      });
    });
  }

  setCurrentLoocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getAddress(this.latitude, this.longitude);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  getAddress(latitude: number, longitude: number) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status == 'OK') {
        if (results[0]) {
          this.address = results[0].formatted_address;
          this.locationEmitter.emit({'address': this.address, 'latitude' : latitude, 'longitude': longitude});
        }
        else {
          window.alert('No result found');
        }
      }
      else {
        window.alert('Geocoder failed due to : ' + status);
      }
    });
  }

}

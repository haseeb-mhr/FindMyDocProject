import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user.model';
import { ApplicationService } from '../_services/application.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.sass']
})
export class UserDetailsComponent implements OnInit {
userList : User[];
  constructor(private applicationSvc: ApplicationService) { }

  ngOnInit(): void {
    this.applicationSvc.getAllUser().subscribe(response => {
      this.userList = response;
    }, error => {
      console.log(error);
    });
  }

}

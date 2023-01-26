import { Genders } from "../enums/user-gender.model";
import { UserRoles } from "../enums/user-roles.model";


export class User {
   id: number;
   email: string;
   firstName: string;
   lastName: string;
   userTitle: string;
   gender: Genders;
   phoneNo: string;
   password: string;
   photoFileName: string;
   userRole: UserRoles;


   constructor(email: string, firstName: string, lastName: string, userTitle: string, gender: string, phoneNo: string, password: string, userRole: UserRoles = UserRoles.User) {
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.userTitle = userTitle;
      this.gender = gender == 'Male' ? Genders.Male : gender == 'Female' ? Genders.Female : Genders.Non_Binary;
      this.phoneNo = phoneNo;
      this.password = password;
      this.userRole = userRole;
      this.photoFileName = "Resources\Images\sample.jpg";
   }
}
import { DoctorLocation } from "./doctor-location.model";
import { DoctorQualification } from "./doctor-qualification.model";
import { DoctorSpecialization } from "./doctor-specialization.model";
import { User } from "./user.model";

export class Doctor{
    user: User;
    doctorLocations: DoctorLocation[];
    doctorQualifications: DoctorQualification[];
    doctorSpecializations: DoctorSpecialization[];
}
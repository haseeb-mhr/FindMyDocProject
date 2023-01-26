
export class DoctorCards{
    imgPath: string;
    speciality: string;
    experience: string;

    constructor(imgPath: string, speciality: string, experience: string){
        this.imgPath = imgPath;
        this.speciality = speciality;
        this.experience = experience;
    }
}
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  server_url: 'http://localhost:4200',
  production: false,
  default_browser_title: 'Find My Doctor',
  api: {
    baseUrl: 'https://localhost:44356',
    photo_access_url: 'https://localhost:44356/',
    routes: {
      check_user_cnic: '/auth/check_user_cnic',
      generate_validation_code: '/auth/generate_validation_code',
      user_cnic: '/auth/user_cnic',
      check_login_credential: '/auth/check_login_credential',
      register_user: '/auth/register_user',
      check_link: '/auth/check_reset_password_link',
      forgot_password: '/auth/forgot_password',
      reset_password: '/auth/reset_password',
      contact_us: '/auth/contact_us',
      login_authentication: '/auth',
      signin_user: '/auth/sign_in',
      signup_user: '/auth/sign_up',
      get_all_users: '/auth/get_all_user',
      update_user: '/auth/update_user',
      delete_user: '/auth/delete_user',

      save_file_photo: 'auth/person/save_file',

      doctor: '/doctor',
      register_doctor: '/doctor/register',
      get_all_doctors: '/doctor/get_all_doctors',
      update_doctor_location : '/doctor/update_doctor_location',
      update_doctor_qualification : '/doctor/update_doctor_qualification',
      update_doctor_specialization : '/doctor/update_doctor_specialization',

      get_notifications: '/notification',
      read_notifications: '/notification/read',
      dismiss_notifications: '/notification/dismiss',
    }
  },
  admin: {
    toast_delay: 5000
  }
};


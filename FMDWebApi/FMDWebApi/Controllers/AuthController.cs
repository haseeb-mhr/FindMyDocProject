using CMSBackEndAPI.Util;
using FMDWebApi.Common.AlertModels;
using FMDWebApi.Common.Services;
using FMDWebApi.DAL;
using FMDWebApi.Models;
using FMDWebApi.Models.Enums;
using FMDWebApi.Models.FrontEnd;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace FMDWebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : FMDController
    {
        private readonly CacheObject cacheObject;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly string _resetPasswordPath;

        public AuthController(IAlert alert, IOptions<ResetPasswordPath> resetPasswordPath, FMDDbContext dbContext, IWebHostEnvironment hostingEnvironment) : base(dbContext, alert)
        {
            cacheObject = new CacheObject(dbContext);
            _resetPasswordPath = resetPasswordPath.Value.ResetPasswordUrl;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok("API Started");
        }

        [HttpPost, DisableRequestSizeLimit]
        public IActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }


        [HttpPost("generate_validation_code")]
        public IActionResult CNICExists([FromBody] ForgotPasswordRequest req)
        {
            //Setting the expiry Hour.
            int expiryHrs = 1;
            try
            {
                expiryHrs = Int32.Parse(_dbContext.Settings.Where(x =>
                x.Key.Equals("ResetPasswordTokenExpiry")).FirstOrDefault().Value);
            }
            catch (Exception) { }

            //Generate a code for verification of email, and store it in cache against email.
            int code = Helper.GenerateEmailVerificationCode(req.Email, expiryHrs, cacheObject);

            string appendText = (expiryHrs > 1) ? " hours" : " hour";

            _alert.RaiseEmailVerificationAlert(new EmailVerificationAlert()
            {
                Email = req.Email,
                VerificationCode = code,
                LinkExpiry = expiryHrs.ToString() + appendText
            });
            return Ok(code.ToString());
        }

        [HttpPost("check_user_cnic")]
        public IActionResult CNICExists([FromBody] LoginRequest loginRequest)
        {
            User user = _dbContext.Users.Where(u => u.Email == loginRequest.Email).FirstOrDefault();
            if (user == null)
            {
                return Ok(UserStatus.EmailNotInUse);
            }
            else
                return Ok(UserStatus.EmailExists);
        }

        [HttpPost("check_login_credential")]
        public IActionResult UserExists([FromBody] LoginRequest loginRequest)
        {
            User user = _dbContext.Users.Where(u => u.Email == loginRequest.Email).FirstOrDefault();
            if (user == null)
                return BadRequest();
            else
            {
                if (user.Password != loginRequest.Password)
                    return BadRequest();
                else
                    return Ok(user);
            }
        }

        [HttpPost("register_user")]
        public IActionResult RegisterUser([FromBody] User user)
        {
            //string[] splitList = user.Email.Split('&');
            //string code = splitList[1];
            //string cachedCode = cacheObject.GetToken(splitList[0] + "Code");

            //if (cachedCode == null)
            //    return BadRequest("Your code has expired.");

            //if (code != cachedCode)
            //    return BadRequest("Your code is invalid.");

            //user.Email = splitList[0];
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            user.UserRole = UserRoles.User;
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();

            return Ok(user);
        }

        [HttpPost("forgot_password")]
        public IActionResult ForgotPassword([FromBody] ForgotPasswordRequest req)
        {
            //Decoding the Email
            var email = Helper.Base64Decode(req.Email);
            //Fetch Registered User From Database
            var user = FetchRegisteredUser(email);
            if (user == null)
                return Ok("unregistered");

            //Setting the expiry Hour.
            int expiryHrs = 1;
            try
            {
                expiryHrs = Int32.Parse(_dbContext.Settings.Where(x =>
                x.Key.Equals("ResetPasswordTokenExpiry")).FirstOrDefault().Value);
            }
            catch (Exception) { }

            //Generate an Encoded Guid as token, and store it in cache against email.

            string token = email + ',' + Helper.GenerateResetPasswordToken(email, expiryHrs, cacheObject);
            //embed email with token, encrypt and send it in email
            string encodedToken = Helper.Base64Encode(token);
            //pass the encoded email and encoded token to generate password reset link.
            string url = GetResetEmailLink(req.Email, encodedToken);

            string appendText = (expiryHrs > 1) ? " hours" : " hour";

            _alert.RaiseResetPasswordEmailAlert(new ResetPasswordAlert()
            {
                UserId = user.Id,
                ResetPasswordLink = url,
                LinkExpiry = expiryHrs.ToString() + appendText
            });

            return Ok("registered");
        }

        [HttpPost("contact_us")]
        public IActionResult ContactUsEmail([FromBody] ContactUs contactUs)
        {
            contactUs.isRegistered = true;
            //Fetch Registered User From Database
            var user = _dbContext.Users.Where(u => u.Email == contactUs.Email).FirstOrDefault();
            if (user == null)
                contactUs.isRegistered = false;

            _alert.RaiseContactUsEmailAlert(contactUs);

            return Ok("registered");
        }


        [HttpPost("check_reset_password_link")]
        public IActionResult CheckResetPasswordLink([FromBody] ResetPasswordRequest req)
        {
            string[] details = req.Code.Split('.', (char)StringSplitOptions.RemoveEmptyEntries);
            string email = Helper.Base64Decode(details[0]);
            string token = Helper.Base64Decode(details[1]);

            var user = FetchRegisteredUser(email);

            if (user == null)
                return Ok("User does not exist anymore.");

            string cachedToken = cacheObject.GetToken(email);

            if (cachedToken == null)
                return Ok("Your link has expired.");

            try
            {
                //_tokenProtector.Unprotect(token)
                if (!cachedToken.Equals(token.Split(',', (char)StringSplitOptions.RemoveEmptyEntries)[1]))
                    return Ok("Your link is invalid or expired.");
            }
            catch (CryptographicException)
            {
                return BadRequest("Your token is invalid.");
            }
            return Ok(true);
        }

        [HttpPost("reset_password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordRequest req)
        {
            string[] details = req.Code.Split('.', (char)StringSplitOptions.RemoveEmptyEntries);

            string email = Helper.Base64Decode(details[0]);
            string decryptedToken = "";

            User user = null;
            if (string.IsNullOrEmpty(req.OldPassword))
            {
                //incase of forgot password  
                try
                {
                    string token = Helper.Base64Decode(details[1]);
                    // if this token can't be decrypted, it means our request for forget password is not valid. so following "Unprotect" call will throw exception

                    //_tokenProtector.Unprotect(token)
                    var unprotectedToken = token.Split(',', (char)StringSplitOptions.RemoveEmptyEntries);
                    // in case of forget password, we will fetch user on the basis of email embedded in encrypted token
                    // because we dont trust encoded email in req.Code
                    email = unprotectedToken[0];
                    decryptedToken = unprotectedToken[1];
                    user = FetchRegisteredUser(email);
                }
                catch (CryptographicException)
                {
                    return BadRequest("Your token is invalid.");
                }
            }
            else
            {
                // in case of reset password, we will fetch user on the basis of email in req.Code.
                // but we will verify the integrity of request on the basis of current password in request.
                user = FetchRegisteredUser(email);
                if (user == null)
                    return Ok("User with current email does not exist.");
                var oldPassword = Helper.Base64Decode(req.OldPassword);
                try
                {
                    //_dataProtector.Unprotect(user.Password)
                    if (!oldPassword.Equals(user.Password))
                    {
                        return Ok("Incorrect password.");
                    }
                }
                catch (CryptographicException)
                {
                    return BadRequest("Sorry! Your request cannot be processed at the moment. Please try Forget Password.");
                }
            }

            if (user == null)
                return Ok("User with current email does not exist.");


            //update password in db
            string password = Helper.Base64Decode(req.Password);
            //_dataProtector.Protect(password)
            user.Password = password;
            _dbContext.SaveChanges();

            //var applicationLog  UserId = user.Id, Level = "Info", Message = "Password has been reset."

            cacheObject.RemoveObject(email, decryptedToken);
            //Helper.RemoveResetPasswordToken(email, decryptedToken, _cache);
            _alert.RaiseResetPasswordSuccessEmailAlert(user.Id);
            return Ok("Password has been reset.");
        }

        [HttpGet("user_cnic")]
        public IActionResult GetUser(string cnic)
        {
            User user = _dbContext.Users.Find(cnic);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("get_all_user")]
        public IQueryable<User> GetUsers(User user)
        {
            return _dbContext.Users;
        }

        [HttpPut("update_user")]
        public IActionResult PutReport(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _dbContext.Entry(user).State = EntityState.Modified;

            try
            {
                _dbContext.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(user.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Updated");
        }

        private User FetchRegisteredUser(string email)
        {
            return _dbContext.Users.Where(dbUser => dbUser.Email == email).FirstOrDefault();
        }

        private string GetResetEmailLink(string email, string token)
        {
            return _resetPasswordPath + email + '.' + token;
        }

        private bool UserExists(int userId)
        {
            return _dbContext.Users.Count(e => e.Id == userId) > 0;
        }

    }
}
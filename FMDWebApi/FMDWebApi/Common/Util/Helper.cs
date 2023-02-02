using FMDWebApi.Common.AlertModels;
using System;
using System.Text;

namespace CMSBackEndAPI.Util
{
    public class Helper
    {
        public static string Base64Decode(string encodedString)
        {
            byte[] data = Convert.FromBase64String(encodedString);
            return Encoding.UTF8.GetString(data);
        }

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            return Convert.ToBase64String(plainTextBytes);
        }

        public static string GenerateResetPasswordToken(string email, int expiry, CacheObject cacheObject)
        { 
            string token = Guid.NewGuid().ToString();
            cacheObject.Set(email, token, DateTimeOffset.Now.AddHours(expiry));
            return token;
        }

        public static int GenerateEmailVerificationCode(string email, int expiry, CacheObject cacheObject)
        { 
            int code = 0;
            // Convert the string into a byte[].
            byte[] asciiValues = Encoding.ASCII.GetBytes(email);
            
            foreach (byte asciiValue in asciiValues)
                code += asciiValue;
            
            cacheObject.Set(email+"Code", code.ToString(), DateTimeOffset.Now.AddHours(expiry));
            return code;
        }
    }
}
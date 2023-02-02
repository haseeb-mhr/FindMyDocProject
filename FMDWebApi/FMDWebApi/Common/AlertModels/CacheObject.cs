using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using FMDWebApi.DAL;

namespace FMDWebApi.Common.AlertModels
{
    public class CacheObject
    {
        private readonly FMDDbContext dbContext;
        public CacheObject(FMDDbContext context)
        {
            dbContext = context;
        }

        [Key]
        public string Key { get; set; }
        public string Value { get; set; }
        public DateTimeOffset DateTimeOffset { get; set; }
        public byte IsExpired { get; set; }

        CacheObject(string key, string value, DateTimeOffset dateTime, byte expired)
        {
            this.Key = key;
            this.Value = value;
            this.DateTimeOffset = dateTime;
            this.IsExpired = expired;
        }

        internal void Set(string key, string value, DateTimeOffset dateTimeOffset, byte isExpired = 0)
        {

            CacheObject cacheObject = dbContext.CacheObjects.Find(key);
            if (cacheObject == null)
            {
                cacheObject = new CacheObject(key, value, dateTimeOffset, isExpired);
                dbContext.CacheObjects.Add(cacheObject);
            }
            else
            {
                cacheObject.Value = value;
                cacheObject.DateTimeOffset = dateTimeOffset;
                cacheObject.IsExpired = isExpired;
            }
            dbContext.SaveChanges();
        }

        internal string GetToken(string key)
        {
            CacheObject cacheObject = dbContext.CacheObjects.Find(key);
            if (cacheObject == null)
                return null;
            if (cacheObject.IsExpired == 0)
                if (cacheObject.DateTimeOffset > DateTimeOffset.Now)
                    return cacheObject.Value;
                else
                {
                    cacheObject.IsExpired = 1;
                    dbContext.SaveChanges();
                }
            return null;
        }

        internal bool RemoveObject(string key, string token)
        {
            string cachedToken = GetToken(key);
            if (!string.IsNullOrEmpty(cachedToken) && cachedToken.Equals(token))
            {
                CacheObject cacheObject = dbContext.CacheObjects.Find(key);
                if (cacheObject == null)
                    return false;

                dbContext.CacheObjects.Remove(cacheObject);
                dbContext.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace PicGameOn.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
       // private List<string> filenames = new List<string>();
        private string[] ImageSet { get; set; }

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
           // Uri path = new Uri(HttpContext.Request.Scheme + "://" + HttpContext.Request.Host + HttpContext.Request.PathBase + "/Images");
           // imagePath = ".."+path.AbsolutePath;
            ReadImagesFromDirectory();
        }

        public JsonResult OnGetMatchNationality(string imageName, string nationalityName)
        {
            string filename = RemoveImage(imageName);
            if (!string.IsNullOrEmpty(filename))
            {
                if (Constants.DIRECTORY_TO_NATIONALITY[filename.Replace("../Images/","").Split("/")[0]].StartsWith(nationalityName))
                    return new JsonResult(new { matched = true, score = 20 });
            }
            return new JsonResult(new { matched = false, score = 5 });
        }

        public JsonResult OnGetImageSet()
        {
            ImageSet = GetAnImageSet();
            return new JsonResult(new { images= ImageSet, count= ImageSet.Length });
        }

        public JsonResult OnGetExcludeImage(string imageName)
        {
            if (!string.IsNullOrEmpty(RemoveImage(imageName)))
                return new JsonResult(new { found = true, success = true });

            return new JsonResult(new { found = false, success = true });
        }


        #region Helper Methods

        private string RemoveImage(string imageName)
        {
            try
            {
                if (Constants.FILE_NAMES.Count > 0)
                {
                    string filename = Constants.FILE_NAMES.Where(f => f.EndsWith(imageName)).FirstOrDefault(); //"chifoldername/imagename.jpg"
                    if (!string.IsNullOrEmpty(filename))
                    {
                        Constants.FILE_NAMES.Remove(filename);
                        return filename;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
            }
            return "";
        }

        private string[] GetAnImageSet()
        {
            try
            {
                if (Constants.FILE_NAMES == null || Constants.FILE_NAMES.Count < 10)
                    ReadImagesFromDirectory();

                if (Constants.FILE_NAMES != null || Constants.FILE_NAMES.Count >= 10)
                {
                    string[] imageSet = Constants.FILE_NAMES.Take(10).ToArray();
                    Extensions.Shuffle<string>(imageSet);
                    return imageSet;
                }
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message, ex);
            }
            return new string[] { };
        }   

        private void ReadImagesFromDirectory()
        {
            try
            {
                Constants.FILE_NAMES = new List<string>();
                string[] allowedExtensions = new string[] { ".jpg", ".jpeg", ".png" };
                foreach (string dir in Directory.GetDirectories(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Images/")))
                {
                    List<string> files = Directory.EnumerateFiles(dir).Where(file => allowedExtensions
                        .Contains(Path.GetExtension(file), StringComparer.OrdinalIgnoreCase))
                        .Select(p => ".." + p.Split("wwwroot")[1].Replace('\\', '/')).Distinct()
                        .ToList();
                    if (files != null && files.Count > 0)
                        Constants.FILE_NAMES.AddRange(files);
                }
                if (Constants.FILE_NAMES.Count > 1)
                {
                    Extensions.Shuffle<string>(Constants.FILE_NAMES);
                }
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message, ex);
            }
        }

        #endregion
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PicGameOn
{
    public static class Constants
    {
        public static List<string> FILE_NAMES = new List<string>();

        public static Dictionary<string, string> DIRECTORY_TO_NATIONALITY = new Dictionary<string, string>() {
            { "7c9e6679-7425-40de-944b-eO7fa1f90ce7", "japanese"}, { "7c9e6679-7425-40de-944b-e07fa1f90ac7", "chinese" },
            { "7c9e6679-7425-40de-944b-e07fc1f90ae7", "korean"}, { "7c9e6679-7425-40df-944b-e07fc1f90ae7", "thai" }
        };
    }
}

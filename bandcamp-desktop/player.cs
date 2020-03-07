using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace bandcamp_desktop
{
    public partial class player : Form
    {
        private string dir = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile) + "\\bandcamp-desktop";
        public string id = "";

        public player()
        {
            InitializeComponent();
            string url = File.ReadAllText(dir + "\\v.temp");
            File.Delete(dir + "\\v.temp");
            string source = "https://codegiuliotop.000webhostapp.com/dev/bandcamp-desktop/getid.php?url=" + url;
            System.Net.WebClient client = new System.Net.WebClient();
            byte[] data = client.DownloadData(source);
            string html = System.Text.Encoding.UTF8.GetString(data).Replace("<br>", "\n");
            string[] htmls = Regex.Split(html, "[\r\n]+");
            string id = htmls.Skip(0).Take(1).First();
            if(id != "")
            {
                open(id);
            }
        }

        private void Button1_Click(object sender, EventArgs e)
        {
            open(idtxt.Text);
        }

        private void open(string id)
        {
            webplayer.Load("https://giuliodematteis.altervista.org/bandcamp-desktop/player.php?id=" + id);
            this.Size = new Size(400, 600);
            webplayer.Visible = true;
        }
    }
}

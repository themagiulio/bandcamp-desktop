using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using CefSharp;
using CefSharp.WinForms;

namespace bandcamp_desktop
{
    public partial class Form1 : Form
    {
        public ChromiumWebBrowser chromeBrowser;
        private string dir = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile) + "\\bandcamp-desktop";

        public Form1()
        {
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            InitializeComponent();
            InitializeChromium();
        }

        private void InitializeChromium()
        {
            CefSettings settings = new CefSettings();
            settings.CachePath = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + @"\CEF";
            Cef.Initialize(settings);
            chromeBrowser = new ChromiumWebBrowser("https://bandcamp.com");
            chromeBrowser.DownloadHandler = new DownloadHandler();
            chromeBrowser.LifeSpanHandler = new LifeSpanHandler();
            this.container.Controls.Add(chromeBrowser);
            chromeBrowser.Dock = DockStyle.Fill;
        }

        private void AboutBandcampDesktopToolStripMenuItem_Click(object sender, EventArgs e)
        {
            about f1 = new about();
            f1.Show();
        }

        private void BuyBandcampGigtCToolStripMenuItem_Click(object sender, EventArgs e)
        {
            chromeBrowser.Load("https://bandcamp.com/gift_cards");
        }

        private void search(string filter)
        {
            chromeBrowser.Load("https://bandcamp.com/tag/" + filter);
        }

        private void AcousticToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Acoustic";
            search(filter);
        }

        private void AlternativeToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Alternative";
            search(filter);
        }

        private void AlternativeRockToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Alternative-Rock";
            search(filter);
        }

        private void AmbientToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Ambient";
            search(filter);
        }

        private void ElectronicToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Electronic";
            search(filter);
        }

        private void ExperimentalToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Experimental";
            search(filter);
        }

        private void FolkToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Folk";
            search(filter);
        }

        private void HipHopRapToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Hip-Hop";
            search(filter);
        }

        private void HouseToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "House";
            search(filter);
        }

        private void IndieToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Indie";
            search(filter);
        }

        private void IndieRockToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Indie-Rock";
            search(filter);
        }

        private void JazzToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Jazz";
            search(filter);
        }

        private void MetalToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Metal";
            search(filter);
        }

        private void NoiseToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Noise";
            search(filter);
        }

        private void PopToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Pop";
            search(filter);
        }

        private void PunkToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Punk";
            search(filter);
        }

        private void RapToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Rap";
            search(filter);
        }

        private void RockToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Rock";
            search(filter);
        }

        private void SkaPunkToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Ska-Punk";
            search(filter);
        }

        private void TechnoToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string filter = "Techno";
            search(filter);
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            Cef.Shutdown();
        }

        private void MoreToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            chromeBrowser.Load("https://bandcamp.com/tags");
        }

        private void MiniPlayerToolStripMenuItem_Click(object sender, EventArgs e)
        {
            File.WriteAllText(dir + "\\v.temp", chromeBrowser.Address);
            player f2 = new player();
            f2.Show();
        }
    }
}

namespace bandcamp_desktop
{
    partial class player
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(player));
            this.idtxt = new System.Windows.Forms.TextBox();
            this.button1 = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.webplayer = new CefSharp.WinForms.ChromiumWebBrowser();
            this.label2 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // idtxt
            // 
            this.idtxt.Location = new System.Drawing.Point(147, 32);
            this.idtxt.Name = "idtxt";
            this.idtxt.Size = new System.Drawing.Size(164, 20);
            this.idtxt.TabIndex = 0;
            // 
            // button1
            // 
            this.button1.Font = new System.Drawing.Font("Lato", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.button1.Location = new System.Drawing.Point(247, 65);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 1;
            this.button1.Text = "Go!";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.Button1_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Lato", 9.749999F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(22, 32);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(119, 16);
            this.label1.TabIndex = 2;
            this.label1.Text = "Album, EP, Song ID:";
            // 
            // webplayer
            // 
            this.webplayer.ActivateBrowserOnCreation = false;
            this.webplayer.Dock = System.Windows.Forms.DockStyle.Fill;
            this.webplayer.Location = new System.Drawing.Point(0, 0);
            this.webplayer.Name = "webplayer";
            this.webplayer.Size = new System.Drawing.Size(334, 113);
            this.webplayer.TabIndex = 3;
            this.webplayer.Visible = false;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Lato", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(12, 65);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(225, 39);
            this.label2.TabIndex = 4;
            this.label2.Text = "Note that if you open the Mini Player from\r\nthe Album, EP, Song page. It will aut" +
    "omatically\r\nplay it.";
            // 
            // player
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(334, 113);
            this.Controls.Add(this.webplayer);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.idtxt);
            this.Controls.Add(this.label2);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "player";
            this.Text = "bandcamp Desktop - Mini Player";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox idtxt;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Label label1;
        private CefSharp.WinForms.ChromiumWebBrowser webplayer;
        private System.Windows.Forms.Label label2;
    }
}
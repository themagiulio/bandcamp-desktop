# Bandcamp Desktop
Bandcamp Desktop is a crossplatform desktop application which allows you to use bandcamp.com in an easy and quick way.

Note that Bandcamp Desktop is not affiliated with Bandcamp, it is only a fan-made, free and Open-Source project.

![Alt Text](https://codegiuliotop.000webhostapp.com/bin/bd.png)

## Features
- Simple as the website
- Header menu
- Mini Player
- Directly download Music from Bandcamp

### Mini Player
Keep listening to the music while you explore the website! That's the killer feature of this web application.

It's very simple to use: just go to the album (or song, ep...) and click File > Mini Player (or press Ctrl + Space).

### Directly download Music from Bandcamp
Bandcamp Desktop is able to directly download music from Bandcamp. Your albums and songs will be automatically unzipped and stored in the `bandcamp-desktop` folder which is located in your default `download` folder (Library Folder can be changed from App Preferences).

## Download & Install Instructions
1) Download the <a href="https://github.com/themagiulio/bandcamp-desktop/releases/latest">Latest Release</a> for your OS.
Bandcamp Desktop is available for Windows, Mac OSX and Linux.
2) Run it and install the application.

<em>Note: depending on your OS settings, you may receive a security warning upon installation. This has to do with Bandcamp Desktop being an unsigned application. You can find out more by researching code-signing for Apple and Microsoft.</em>

## Build from the master branch
I try to publish a new version every month with new features and improvements. If you don't want to wait you can clone this repository and build Bandcamp Desktop from source.<br/>
If you don't know how to do it I created a simple Python script which does it for you.

In order to continue, you need to install the following softwares:
- <a href="https://nodejs.org/en/">node.js</a>
- <a href="https://www.python.org/">Python</a> and <a href="https://pip.pypa.io/en/stable/">pip</a>
- The following Python packages:
    - inquirer
    - GitPython
    - pynpm

To install a Python package you simply need to write in the Command Line:
```
pip install <Package Name>
```
After that you just need to download and run the script <a href="https://gist.github.com/themagiulio/4faae10ac7514cb2e26e8bc1009e83e4">bandcamp-desktop_from_master.py</a>:
```
python bandcamp-desktop_from_master.py
```

## Developer Install Instructions

1) Download <a href="https://nodejs.org/en/">node.js</a>.
2) Enter in the software folder and run `npm install`.
3) Edit what you want.
4) Run `npm start`.

## Developer Build Instructions

1) Edit the build script in `package.json` and set your current OS.
2) Run `npm run-script build`.

<em>Note: if you fork <a href="https://github.com/themagiulio/bandcamp-desktop">themagiulio/bandcamp-desktop</a> you need to change the repository in `package.json` in order to deploy a new version (using: `npm run-script deploy`).</em>

<!--img alt="OSMD logo" src="https://osmd.org/wp-content/uploads/2016/05/OSMD_3_icon_only.svg" width="200"/-->
<img src="https://user-images.githubusercontent.com/33069673/70326774-a17eda80-1835-11ea-9334-be36e660acbe.png" width="200">
<!--img alt="Brought to you by PhonicScore" src="https://phonicscore.com/neu/wp-content/uploads/2018/06/phonicscore_brown.svg"/-->

# OpenSheetMusicEducation

Open Sheet Music Education: A configurable generator for sight reading practice sheets.
[opensheetmusiceducation.org](https://opensheetmusiceducation.org/)

See our sister project [OpenSheetMusicDisplay](https://github.com/opensheetmusicdisplay/opensheetmusicdisplay), our underlying rendering technology used to display the sheets in OSMD.

Written in [TypeScript](https://www.typescriptlang.org) and released under [BSD license](https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/blob/develop/LICENSE).

Try the [Demo](https://opensheetmusicdisplay.github.io/demo/) to see what OSMD can do.

Brought to you by [PhonicScore](https://phonicscore.com/)
(Creators of [PracticeBird for iOS](https://itunes.apple.com/us/app/practice-bird-pro/id1253492926?ls=1&mt=8) and [PhonicScore for Android](https://play.google.com/store/apps/details?id=phonicscore.phonicscore_lite))<br>
and [our Github Contributors](https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/graphs/contributors)

To contact us directly, you can use the [Contact form on opensheetmusicdisplay.org](https://opensheetmusicdisplay.org/contact/),
or<br>
[join the chat on Gitter](https://gitter.im/opensheetmusicdisplay/opensheetmusicdisplay).

If you'd like to support OSMD and our ongoing work, you can donate via PayPal:<br>
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FPHCYVV2HH8VU)<br>
Any support is highly appreciated.

# Run a local demo

This debugging guide assumes you have setup the project correctly, see [Build Instructions](https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/wiki/Build-Instructions).

To run the local demo and test your MusicXML files:
* run `npm start` in your cloned repository folder
* open `http://localhost:8000/` in your Browser
* To render your own MusicXML file, drag&drop it into the window.
* It should look similar to our [public demo](https://opensheetmusicdisplay.github.io/demo/), except for a different interface and state of code.<br>
The public demo is on the state of the last release, which can be useful to compare.

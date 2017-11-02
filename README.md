# Cats Widget

This YouTrack Widget allows you to add one or several cats from 
[Cat Power Animated](http://iconka.com/en/downloads/cat-power-animated/) collection
to your YouTrack Dashboard. 

Requires YouTrack 2017.3 or higher. 

# Developing

1. NodeJS and NPM are required
2. Install http-server `npm i http-server -g`
3. Run it in example folder `http-server . --cors -c-1 -p 9033`
4. If you have Hub running over HTTPS, you need to host your widget over HTTPS as well. 
[https://ngrok.com](https://ngrok.com) should help.
5. Open widgets playground (/dashboard/widgets-playground) and enter your devserver address.

# Packing

1. Just archive all content as ZIP file and it is ready to upload (/widgets)

# Licencing

The code of this widget except for the content of the `images` directory is licensed with Apache 2.0.

The content of the `images` directory is the property of [Iconka.com](http://iconka.com) 
and is used in this widget according to [Free License](http://iconka.com/en/licensing/) terms.
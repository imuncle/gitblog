# gitblog
This is a very small personal blog template bsaed on git issues for anyone who wants to build a personal blog on GitHub pages.

[Demo page](https://imuncle.github.io/gitblog)

[中文](README.md)

# Functions
- [x] Publish an article
- [x] Article comments
- [x] Set labels for article
- [x] Search for aticle
- [x] Like an article or comment

You can publish your article in Github issues page, just click 'New issue'.

The comments feature is referenced by [Gitment](https://github.com/imsun/gitment). I borrowed its css and rewrite the js doc.

You can set labels for each article in Github issues page, and all the labels will become an item in menu. So be sure to delete the default labels that Github provide.

## How to Start
### Get this repo
You can **Fork** or **clone** this repo. Then you can customize by yourself.

### Get Github OAuth APP
Click [here](https://github.com/settings/applications/new) to get a Github OAuth APP. Be sure that the **callback URL** is your own home website, such as 'https://imuncle.github.io' .

You'll get **client_id** and **client_secret** finally.

## Personalized customization
### Basic configuration
In **config.json**:
```js
{
    "name": "your github username",
    "repo": "your github reponame",
    "client_id": "your client_id here",
    "client_secret": "your client_secret here",
    "title": "add your title",
    "instruction": "add your instruction",
    "server_link": "http://119.23.8.25/gh-oauth-server.php",
    "pin_links": {
        //add the page title and the URL/issue_Id to pin these pages
        //example:
        //RSS : "https://rsshub.app/github/issue/imuncle/imuncle.github.io",
        //About me : "1" (must be a string not a number)
    },
    "friends": {
        //add your friends link here
        //example:
        //imuncle : "https://imuncle.github.io"
    },
    "icons": {
        //add your footer icons here
        //you can set a jump link or display an image
        //template :
        //"the title of the icon" : {
        //  "icon_src" : "the image of the icon",
        //  "href" : "the link you want to jump",
        //  "hidden_img" : "the image you want to show",
        //  "width" : the width of the hidden_img, this should be a number.(unit : px)
        //}
        //example :
        //"Github" : {
        //    "icon_src" : "images/github.svg",
        //    "href" : "https://github.com/imuncle",
        //    "hidden_img" : null,
        //    'width" : 0
        //}
    }
}
```
Add your own information into it.

Options|interpretation
:--:|:--:
name|Fill in your GitHub username
repo|Fill in your pages corresponding repository, which is generally: username.github.io
client_id|Fill in the "client id" you got when you applied for OAuth APP
client_secret|Fill in the "client secret" you got when applying for OAuth APP
title|Fill in the title of your personal website
instruction|Fill in the profile of your website
server_link|Fill in your server address, if there is no server to fill in 'http://119.23.8.25/gh-oauth-server.php'
pin_links|Fill in the title and the corresponding issue_id/any URL that need to be fixed in the menu
friends|Fill in the friendship chain of your website (optional)
icons|Fill in the informations of the icons that you want to show at the bottom (optional)

The server_link above is the address of the server, because the access_token of the accessing user must be accessed through the server. Details can be found in [this article] (https://imuncle.github.io/content.html?id=22). This server is written in PHP and is only responsible for requesting the user's access_token and does not store any data. See the [source code](https://github.com/imuncle/gitblog/blob/master/server/gh-oauth-server.php).

If you have a server, you can use the PHP code to configure the server yourself and write **server_link** as your server address.

### Dynamic typing
You can see a dynamic typing effect in the home page in [demo page](https://imuncle.github.io). This is references by [type.js](https://github.com/mattboldt/typed.js). You can config it in **index.html**:

```javascript
$("#changerificwordspanid").typed({
    strings: ["good", "happy", "healthy", "tall"],
    typeSpeed: 100,
    startDelay: 10,
    showCursor: true,
    shuffle: true,
    loop:true
});
```
By changing the `strings`, you can make your own dynamic typing. For more information you can visit [type.js](https://github.com/mattboldt/typed.js).

### Images
All the images are stored in **images** folder. You can change them at will.

### Dependence
* [gitment](https://github.com/imsun/gitment)
* [MathJax](https://www.mathjax.org/)
* [jQuery](http://www.jquery.org/)
* [Bootstrap](http://www.getbootstrap.com/)
* [type.js](https://github.com/mattboldt/typed.js)

## LICENSE
MIT LICENSE

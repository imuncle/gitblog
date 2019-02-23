# gitblog
This is a very small personal blog template bsaed on git issues for anyone who wants to build a personal blog on GitHub pages.

Demo page: [大叔的个人小站](https://imuncle.github.io)

[中文](README.md)

# Functions
- [x] Publish an article
- [x] Article comments
- [x] Set labels for article

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
In **gitblog.js**, you can find the code as follows:
```js
var config = {
    name : "your github username",
    repo : "your github reponame",
    client_id : "your client_id here",
    client_secret : "your client_secret here",
    title : "add your title",
    instruction : "add your instruction",
    server_link : 'your server link here',
    friends : {
        //add your friends link here
        //example:
        //imuncle : 'https://imuncle.github.io',
    },
};
```
Add your own information into it.

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

## LICENSE
MIT LICENSE

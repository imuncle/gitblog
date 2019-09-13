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
- [x] API. It can output 'json' format information. Using methods are at the bottom of README.

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

## API
The details of implementing can be found in [api.html](https://github.com/imuncle/gitblog/blob/master/api.html).

### Get menu lists
```javascript
$.ajax({
    type: 'get',
    headers: {
        Accept: 'application/json',
    },
    url: 'your domain name' + 'api.html?menu=menu',
    success: function(data) {
        //your code here
    }
});
```

The format of json are as follows:
```json
[
	{
		"name": "AI"
	},
	{
		"name": "Project"
	},
	{
		"name": "RM"
	},
	{
		"name": "ROS"
	},
	{
		"name": "other"
	},
	{
		"name": "tools"
	},
	{
		"name": "web"
	}
]
```

### Get the article list
There are 3 modes：Normal Mode(no screening)，Label Mode(screening by label)，Search Mode(screening by search).
```javascript
var request_url = 'your domain name' + 'api.html?';
request_url += 'page=1';    //Normal Mode
request_url += 'label=RM&page=1';   //Label Mode
request_url += 'q=姿态解析&page=1'; //Search Mode
$.ajax({
    type: 'get',
    headers: {
        Accept: 'application/json',
    },
    url: request_url,
    success: function(data) {
        //your code here
    }
});
```
> Parameters of 'page' in the above code are optional.

The format of json are as follows:
```json
{
	"page": 4,
	"page_num": 8,
	"article": [
		{
			"id": 48,
			"time": "2019/4/7 23:00:49",
			"title": "STM32 flash读写",
			"author": "imuncle",
			"content": "文章内容太多了，此处省略...",
			"labels": [
				{
					"name": "RM"
				}
			]
		},
		{
			"id": 47,
			"time": "2019/4/5 01:58:44",
			"title": "WS2811驱动",
			"author": "imuncle",
			"content": "文章内容太多了，此处省略...",
			"labels": [
				{
					"name": "RM"
				}
			]
		},
		{
			"id": 46,
			"time": "2019/4/1 18:57:58",
			"title": "DS18B20温度传感器数据读取",
			"author": "imuncle",
			"content": "文章内容太多了，此处省略...",
			"labels": [
				{
					"name": "other"
				}
			]
		},
		{
			"id": 45,
			"time": "2019/4/1 18:01:15",
			"title": "HAL库实现us级延时",
			"author": "imuncle",
			"content": "文章内容太多了，此处省略...",
			"labels": [
				{
					"name": "other"
				}
			]
		},
		{
			"id": 44,
			"time": "2019/4/1 10:00:40",
			"title": "MPU9250六轴算法",
			"author": "imuncle",
			"content": "文章内容太多了，此处省略...",
			"labels": [
				{
					"name": "RM"
				}
			]
		},
		{
			"id": 43,
			"time": "2019/3/30 09:19:57",
			"title": "MATLAB串口通信GUI程序",
			"author": "imuncle",
			"content": "文章内容太多了，此处省略...",
			"labels": [
				{
					"name": "other"
				}
			]
		},
		{
			"id": 42,
			"time": "2019/3/24 12:01:25",
			"title": "网站搜索功能",
			"author": "imuncle",
			"content": "文章内容太多了，此处省略...",
			"labels": [
				{
					"name": "web"
				}
			]
		},
		{
			"id": 40,
			"time": "2019/3/19 15:19:52",
			"title": "RM2018的奋斗",
			"author": "imuncle",
			"content": "文章内容太多了，此处省略... ",
			"labels": [
				{
					"name": "RM"
				}
			]
		},
		{
			"id": 39,
			"time": "2019/3/18 18:03:35",
			"title": "MPU9250姿态解析",
			"author": "imuncle",
			"content": "文章内容太多了，此处省略...",
			"labels": [
				{
					"name": "RM"
				}
			]
		},
		{
			"id": 38,
			"time": "2019/3/10 19:03:28",
			"title": "生成漂亮的代码分享图",
			"author": "imuncle",
			"content": "文章内容太多了，此处省略...",
			"labels": [
				{
					"name": "tools"
				}
			]
		}
	]
}
```
> In default, each page displays 10 articles.

### Get content of an article
**Attention**: This returns the article content in **HTML format**, while 'Get the article list' gets the article content in **Markdown format**.
```javascript
$.ajax({
    type: 'get',
    headers: {
        Accept: 'application/json',
    },
    url: 'your domain name' + 'api.html?id=1',
    success: function(data) {
        //your code here
    }
});
```

The format of json are as follows:
```json
{
	"title": "博客搭建过程",
	"time": "2019/2/5 16:33:06",
	"content": "文章内容太多了，此处省略...",
	"labels": [
		{
			"name": "web"
		}
	],
	"like": 0
}
```

### Dependence
* [gitment](https://github.com/imsun/gitment)
* [MathJax](https://www.mathjax.org/)
* [jQuery](http://www.jquery.org/)
* [Bootstrap](http://www.getbootstrap.com/)
* [type.js](https://github.com/mattboldt/typed.js)

## LICENSE
MIT LICENSE

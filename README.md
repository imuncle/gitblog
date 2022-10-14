# gitblog
这是一个极轻量级的，基于git issue的个人博客模板，非常适合于想在GitHub pages上搭建个人博客的人。

[示例页面](https://imuncle.github.io/gitblog)

[English](README_en.md)

## 现有功能
- [x] 发表文章
- [x] 文章评论
- [x] 文章、评论分页
- [x] 文章设置标签
- [x] 文章搜索功能
- [x] 文章、评论点赞功能（不能取消点赞 :stuck_out_tongue_winking_eye:
- [x] 博客API接口，可输出`json`格式信息，方便用户进行开发客户端等操作。具体接口使用见说明底部。
- [x] 可根据文章作者和文章状态(close或open)筛选文章，暂不支持多人筛选

博客本身没有发表文章的接口，而是在GitHub的issue页面直接new issue。

评论功能参考了[Gitment](https://github.com/imsun/gitment)，借用了Gitment的css样式，重写了JavaScript逻辑。评论功能基于GitHub的issue，支持Markdown语法，支持@功能，支持点赞功能。

可以在GitHub上为每个文章指定标签label。

404页面模仿了GitHub自己的404页面，可点击[这里](https://imuncle.github.io/anything)查看404页面示例。

## 如何开始

### 复制该仓库
最快捷的方法就是直接**Fork**这个repo，修改仓库名为`username.github.io`格式，然后稍微配置一下就能直接使用了。

第二种办法就是clone仓库

```git
git clone "https:/github.com/imuncle/gitblog"
```

### 申请GitHub OAuth APP
点击[这里](https://github.com/settings/applications/new)申请。

注意申请时的**callback URL**一定要填写正确。一般就写自己网站的首页就行，比如https://imuncle.github.io 。

申请完毕后会拿到对应的唯一的**client_id**和**client_secret**，这两个字符串在后面的配置中会使用到。

## 个性化定制
### 基本配置
修改**config.json**：
```js
{
    "name": "your github username",
    "repo": "your github reponame",
    "client_id": "your client_id here",
    "client_secret": "your client_secret here",
    "title": "add your title",
    "instruction": "add your instruction",
    "server_link": "http://119.23.8.25/gh-oauth-server.php",
    "filter": {
        "creator": "all",	//@param: "all" or a username(eg. "imuncle")
        "state": "open"		//@param: "open", "close", "all"
    },
    "menu": {
        //add your menu items and URL here
        //example:
        //"Home" : "./",
        //"RSS" : "https://rsshub.app/github/issue/imuncle/imuncle.github.io",
        //"About me" : "content.html?id=41"
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
将自己的个人信息填写进去。

选项|含义
:--:|:--:
name|填写你的GitHub用户名
repo|填写你的pages对应的仓库，一般是：用户名.github.io
client_id|填写你申请OAuth APP时拿到的client_id
client_secret|填写你申请OAuth APP时拿到的client_secret
title|填写你的个人网站的标题
instruction|填写你的个人网站的简介
server_link|填写你的服务端地址，~~若没有服务器可填写`http://119.23.8.25/gh-oauth-server.php`~~ 该服务器已停用
filter|填写issue筛选规则，可根据creator和issue state筛选
menu|填写右侧菜单中的名称和链接
friends|填写你的网站的友链，若没有则不填写
icons|填写网站页脚的图标信息，若没有则不填写

上面的server_link是服务端的地址，，因为访问用户的access_token必须通过服务端访问，详情可见[这篇文章](https://imuncle.github.io/content.html?id=22)。这个服务端使用PHP编写，只负责请求用户的access_token，不会存储任何数据。详见[源代码](https://github.com/imuncle/gitblog/blob/master/server/gh-oauth-server.php)。

如果你有服务器，那么你可以使用该PHP代码自己配置服务端，将**server_link**写为自己的服务端地址。

### 动态打字配置
网站首页有一个动态打字的效果，这里参考的是[type.js](https://github.com/mattboldt/typed.js)项目，配置地方在**index.html**中。

找到如下代码（在尾部）：
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
可以更改`strings`来更改单词。更多的配置选项请参考[原项目](https://github.com/mattboldt/typed.js)。

### 图片更改
图片全部都存储在**images**文件夹中。

图片名称|含义
:--:|:--:
404.png|404页面
avatar.jpg|网站图标
fish.png|404页面
github.svg|GitHub图标
house1.png|404页面
house2.png|404页面
page_backfround.jpg|首页的背景图
search.svg|右上角搜索图标
totop.png|右下角“回到顶部”按钮图标

如果没有前端知识，建议更改图片时不要更改文件名。

## API接口
API接口的实现见[api.html](https://github.com/imuncle/gitblog/blob/master/api.html)，通过访问该文件获取信息，使用url参数指定获取的信息内容。具体的用法如下。

### 获取菜单信息
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

返回的数据格式如下：
```json
[
	{
		"name": "首页",
		"url": "./"
	},
	{
		"name": "机器学习",
		"url": "issue_per_label.html?label=AI"
	},
	{
		"name": "小项目",
		"url": "issue_per_label.html?label=Project"
	},
	{
		"name": "RM比赛",
		"url": "issue_per_label.html?label=RM"
	},
	{
		"name": "ROS学习",
		"url": "issue_per_label.html?label=ROS"
	},
	{
		"name": "小工具",
		"url": "issue_per_label.html?label=tools"
	},
	{
		"name": "网页开发",
		"url": "issue_per_label.html?label=web"
	},
	{
		"name": "其他",
		"url": "issue_per_label.html?label=other"
	},
	{
		"name": "灵感想法",
		"url": "https://imuncle.github.io/timeline"
	},
	{
		"name": "关于我",
		"url": "content.html?id=41"
	}
]
```

### 获取文章列表
获取文章列表分为三种模式：一种是无筛选的普通模式，一种是按标签（label）筛选的标签模式，一种是按搜索内容筛选的搜索模式。三种模式都支持分页模式。
```javascript
var request_url = 'your domain name' + 'api.html?';
request_url += 'page=1';    //普通模式
request_url += 'label=RM&page=1';   //标签模式
request_url += 'q=姿态解析&page=1'; //搜索模式
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
> 注：以上代码中`page`参数均为可选。

返回的数据格式如下：
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
> 注：默认一页显示10篇文章

### 获取文章内容
这是获取文章的详细内容。**注意**，这里返回的是**HTML格式**的文章内容，而`获取文章列表`拿到的是**Markdown格式**的文章内容。使用方法如下：
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

返回的数据格式如下：
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

## 依赖
* [gitment](https://github.com/imsun/gitment)
* [MathJax](https://www.mathjax.org/)
* [jQuery](http://www.jquery.org/)
* [Bootstrap](http://www.getbootstrap.com/)
* [type.js](https://github.com/mattboldt/typed.js)

欢迎提issue，也欢迎PR~

## 许可
MIT LICENSE

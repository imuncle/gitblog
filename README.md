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

博客本身没有发表文章的接口，而是在GitHub的issue页面直接new issue。

评论功能参考了[Gitment](https://github.com/imsun/gitment)，借用了Gitment的css样式，重写了JavaScript逻辑。评论功能基于GitHub的issue，支持Markdown语法，支持@功能，支持点赞功能。

可以在GitHub上为每个文章指定标签label，每个label都会作为博客菜单里的一个子菜单项，所以请注意**删除仓库里默认的一些label**。

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
将自己的个人信息填写进去。

选项|含义
:--:|:--:
name|填写你的GitHub用户名
repo|填写你的pages对应的仓库，一般是：用户名.github.io
client_id|填写你申请OAuth APP时拿到的client_id
client_secret|填写你申请OAuth APP时拿到的client_secret
title|填写你的个人网站的标题
instruction|填写你的个人网站的简介
server_link|填写你的服务端地址，若没有服务器可填写'http://119.23.8.25/gh-oauth-server.php'
pin_links|填写需要固定在右侧菜单中的显示名称和对应的issue号/任意链接
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

## 依赖
* [gitment](https://github.com/imsun/gitment)
* [MathJax](https://www.mathjax.org/)
* [jQuery](http://www.jquery.org/)
* [Bootstrap](http://www.getbootstrap.com/)
* [type.js](https://github.com/mattboldt/typed.js)

欢迎提issue，也欢迎PR~

## 许可
MIT LICENSE

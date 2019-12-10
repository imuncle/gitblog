# 稳健的取经少年
这是唯安的个人博客，基于git issue的博客模板，非常适合于想在GitHub pages上搭建个人博客的人。

[访问地址](https://vaeann.github.io/)

## 现有功能
- [x] 发表文章
- [x] 文章评论
- [x] 文章、评论分页
- [x] 文章设置标签
- [x] 文章搜索功能
- [x] 文章、评论点赞功能（不能取消点赞 :stuck_out_tongue_winking_eye:
- [x] 博客API接口，可输出`json`格式信息，方便用户进行开发客户端等操作。具体接口使用见说明底部。

博客本身没有发表文章的接口，而是在GitHub的issue页面直接new issue。

评论功能参考了[Gitment](https://github.com/imsun/gitment)，借用了Gitment的css样式，重写了JavaScript逻辑。评论功能基于GitHub的issue，支持Markdown语法，支持@功能，支持点赞功能。

可以在GitHub上为每个文章指定标签label。

404页面模仿了GitHub自己的404页面，可点击[这里](https://imuncle.github.io/anything)查看404页面示例。


## 小站架构
本站基于GitHub的issue系统搭建，评论功能参考了开源项目[Gitment](https://github.com/imsun/gitment)，借用了该项目的css样式。

文章浏览功能参考GitHub API自己写了一个，发布文章直接在GitHub issue界面进行。

整个博客架构非常简单，核心内容只有四个HTML文件和一个JavaScript文件（gitblog.js）。

```
index.html
content.html
issue_per_label.html
404.html
+ css
|__bootstrap.min.css
|__common.css
|__gitment.css
|__home.css
+ js
|__jquery.min.js
|__typed.js
|__gitblog.js
```

~~后续打算把该博客模板整理出来，单独建个repository。~~

已经开源出来了，详见[gitblog](https://github.com/imuncle/gitblog)。

## 许可
MIT LICENSE

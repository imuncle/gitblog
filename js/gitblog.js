var config = {
    name: "your github username",
    repo: "your github reponame",
    client_id: "your client_id here",
    client_secret: "your client_secret here",
    title: "add your title",
    instruction: "add your instruction",
    server_link: 'your server link here',
    pin_links: {
        //add the page title and the URL/issue_Id to pin these pages
        //example:
        //RSS : "https://rsshub.app/github/issue/imuncle/imuncle.github.io",
        //About me : "1"
    },
    friends: {
        //add your friends link here
        //example:
        //imuncle : 'https://imuncle.github.io',
    },
    icons: {
        //add your footer icons here
        //you can set a jump link or display an image
        //template :
        //the title of the icon : {
        //  icon_src : 'the image of the icon',
        //  href : 'the link you want to jump',
        //  hidden_img : 'the image you want to show',
        //  width : the width of the hidden_img, this should be a number.(unit : px)
        //}
        //example :
        //Github : {
        //    icon_src : 'images/github.svg',
        //    href : 'https://github.com/imuncle',
        //    hidden_img : null,
        //    width : 0
        //}
    }
};

String.prototype.replaceAll = function(a, b) {
    return this.replace(new RegExp(a, 'gm'), b);
}

var gitblog = function(options) {
    var self = this;

    self.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

    self.options = {
        id: null,
        label: null,
        q: null,
        page: 1,
        token: null,
        code: null,
        redirect_url: null,
    }

    self.set = function(options) {
        if (self.getUrlParam('id') != undefined) {
            self.options.id = self.getUrlParam('id');
        }
        if (self.getUrlParam('label') != undefined) {
            self.options.label = self.getUrlParam('label');
        }
        if (self.getUrlParam('q') != undefined) {
            self.options.q = self.getUrlParam('q');
        }
        if (self.getUrlParam('page') != undefined) {
            self.options.page = self.getUrlParam('page');
        }
        if (self.getUrlParam('access_token') != undefined) {
            self.options.token = self.getUrlParam('access_token');
        }
        if (self.getUrlParam('code') != undefined) {
            self.options.code = self.getUrlParam('code');
        }
        if (self.getUrlParam('state') != undefined) {
            self.options.redirect_url = self.getUrlParam('state');
        }

        if (self.options.code != null && self.options.redirect_url != null) {
            window.location.href = config.server_link + "?code=" + self.options.code + "&redirect_url=" + self.options.redirect_url + "&client_id=" + config.client_id + "&client_secret=" + config.client_secret;
        }

        for (var i in options) {
            if (self.options[i] != undefined) {
                self.options[i] = options[i];
            }
        }
    }

    self.set(options);

    self.utc2localTime = function(time) {
        var time_string_utc_epoch = Date.parse(time);
        var unixTimestamp = new Date(time_string_utc_epoch);
        return unixTimestamp.toLocaleString();
    }

    var Info = function() {
        this.title = config.title;
        this.instruction = config.instruction;
    }

    Info.prototype.init = function() {
        $('#title').text(this.title);
        $('#instruction').text(this.instruction);
        document.getElementsByTagName("title")[0].innerText = this.title;
    }

    var Menu = function() {
        this.labels = [];
    }

    Menu.prototype.getItem = function() {
        $.ajax({
            type: 'get',
            url: 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/labels',
            success: function(data) {
                for (var i in data) {
                    document.getElementById('menu').innerHTML += '<li><a href="issue_per_label.html?label=' + data[i].name + '"><span>' + data[i].name + '</span></a></li>';
                }
                for (var name in config.pin_links) {
                    var targetUrl;
                    //Check whether it is an external URL, if not, link to the corresponding page by issue_id
                    if (config.pin_links[name].indexOf("http") == -1) {
                        targetUrl = "content.html?id=" + config.pin_links[name];
                    } else if (config.pin_links[name].indexOf("http") != -1) {
                        targetUrl = config.pin_links[name];
                    }
                    document.getElementById('menu').innerHTML += '<li><a href="' + targetUrl + '"><span>' + name + '</span></a></li>';
                }
            },
        });
    }

    Menu.prototype.searchOnblur = function() {
        if ($('.search-input').val() == "") {
            $(".search-input").css("width", '42px');
            $(".search-input").css("z-index", -1);
        }
    }

    Menu.prototype.show = function() {
        this.getItem();
        document.getElementById('menu').innerHTML += '<li><a href="./"><span>首页</span></a></li>';
        if (Object.keys(config.friends).length != 0) {
            var menu_friend = document.getElementById("friends");
            menu_friend.innerHTML = '<li><a><span style="color: white;transform:translateX(4px)">友链：</span></a></li>';
            for (var name in config.friends) {
                menu_friend.innerHTML += '<li><a href=' + config.friends[name] + ' target="_blank"><span>' + name + '</span></a></li>';
            }
        }
        $(".search-input").attr("onblur", "blog.menu.searchOnblur()");
    }

    var Footer = function() {
        this.page = new Pages();
        this.icons = '';
        this.icon_num = 0;
        this.content = 'Powered by <a href="https://github.com/imuncle/gitblog" target="_blank" style="color: aquamarine;text-decoration:none;border-bottom: 1px solid #79f8d4;">gitblog</a>';
    }

    Footer.prototype.showIcon = function() {
        var footer = this;
        for (var i in config.icons) {
            if (config.icons[i].icon_src != undefined && config.icons[i].icon_src != null) {
                footer.icons += '<div style=" padding-inline-start: 0;margin: 0;">';
                if (config.icons[i].href != undefined && config.icons[i].href != null) {
                    footer.icons += '<a target="_blank" title="' + i + '" href="' + config.icons[i].href + '"><img src="' + config.icons[i].icon_src + '" style="width:50px;margin-left:10px;margin-right:10px"></a>';
                } else {
                    if (config.icons[i].hidden_img == undefined || config.icons[i].hidden_img == null) {
                        footer.icons += '<img src="' + config.icons[i].icon_src + '" title="' + i + '" style="width:50px;margin-left:10px;margin-right:10px">';
                    } else {
                        footer.icons += '<img src="' + config.icons[i].icon_src + '" title="' + i + '" onmouseover="blog.footer.changeIcon(' + "'" + i + "'" + ', ' + "'show'" + ')" onmouseout="blog.footer.changeIcon(' + "'" + i + "'" + ', ' + "'hidden'" + ')" style="width:50px;margin-left:10px;margin-right:10px">';
                    }
                }
                if (config.icons[i].hidden_img != undefined && config.icons[i].hidden_img != null) {
                    var left = Object.keys(config.icons).length * 35 - 70 * footer.icon_num + config.icons[i].width / 2 - 35;
                    footer.icons += '<img id="' + i + '" src="' + config.icons[i].hidden_img + '" style="width: ' + config.icons[i].width + 'px; position: absolute; left: calc(50% - ' + left + 'px); bottom: 180px; transition: all 0.3s ease 0s; box-shadow: rgb(149, 165, 166) 0px 0px 5px; transform: translateY(-20px); z-index: -1; opacity: 0;">';
                }
                footer.icons += '</div>';
                footer.icon_num++;
            }
        }
        document.getElementById('icon').innerHTML = footer.icons;
    }

    Footer.prototype.changeIcon = function(id, action) {
        if (action == 'show') {
            $('#' + id).css('z-index', '99');
            $('#' + id).css("opacity", "1");
            $('#' + id).css("transform", "translateY(0)");
        } else if (action == 'hidden') {
            $('#' + id).css('z-index', '-1');
            $('#' + id).css("opacity", "0");
            $('#' + id).css("transform", "translateY(-20px)");
        }
    }

    Footer.prototype.show = function() {
        document.getElementById('footer').innerHTML += this.content;
        this.showIcon();
    }

    var Pages = function() {
        this.page = 1;
        this.pages = 1;
        this.itemNum = 0;
    }

    Pages.prototype.getNum = function(request_url) {
        var page = this;
        if (self.options.page != null && self.options.page != undefined) {
            page.page = self.options.page;
        }
        $.ajax({
            type: 'get',
            url: request_url,
            success: function(data) {
                if (self.options.label != null && self.options.label != undefined) {
                    if (self.options.q != null && self.options.q != undefined) {
                        page.itemNum = data.total_count;
                    } else {
                        page.itemNum = data.length;
                    }
                } else if (self.options.id != null && self.options.id != undefined) {
                    page.itemNum = data.length;
                    document.getElementById('comments-num').innerHTML = page.itemNum;
                } else {
                    page.itemNum = data.open_issues_count;
                }
                if (page.itemNum > 10) {
                    page.pages = Math.ceil(page.itemNum / 10);
                    page.show();
                }
            }
        });
    }

    Pages.prototype.show = function() {
        $('#pages').css('display', 'inline-block');
        document.getElementById('pages').innerHTML = '<li id="last_page"><a href="javascript:blog.content.page.last()">«</a></li>';
        for (var i = 1; i <= this.pages; i++) {
            if (self.options.label != undefined) {
                document.getElementById('pages').innerHTML += '<li><a id="page' + i + '" href="?label=' + self.options.label + '&page=' + i + '">' + i + '</a></li>';
            } else if (self.options.id != undefined) {
                document.getElementById('pages').innerHTML += '<li><a id="page' + i + '" href="?id=' + self.options.id + '&page=' + i + '">' + i + '</a></li>';
            } else {
                document.getElementById('pages').innerHTML += '<li><a id="page' + i + '" href="?page=' + i + '">' + i + '</a></li>';
            }
            if (i == this.page) {
                $('#page' + i).addClass('active');
            } else {
                $('#page' + i).removeClass('active');
            }
        }
        document.getElementById('pages').innerHTML += '<li id="next_page"><a href="javascript:blog.content.page.next()">»</a></li>';
        if (this.page == 1) {
            $('#last_page').css('pointer-events', 'none');
            $('#next_page').css('pointer-events', 'auto');
        } else if (this.page == this.pages) {
            $('#last_page').css('pointer-events', 'auto');
            $('#next_page').css('pointer-events', 'none');
        }
    }

    Pages.prototype.last = function() {
        this.page--;
        if (self.options.label != undefined) {
            window.location.href = '?label=' + self.options.label + '&page=' + this.page;
        } else if (self.options.id != undefined && self.options.id != null) {
            window.location.href = '?id=' + self.options.id + '&page=' + this.page;
        } else {
            window.location.href = '?page=' + this.page;
        }
    }

    Pages.prototype.next = function() {
        this.page++;
        if (self.options.label != undefined) {
            window.location.href = '?label=' + self.options.label + '&page=' + this.page;
        } else if (self.options.id != undefined && self.options.id != null) {
            window.location.href = '?id=' + self.options.id + '&page=' + this.page;
        } else {
            window.location.href = '?page=' + this.page;
        }
    }

    var Reaction = function() {
        this.num = 0;
        this.isLike = false;
    }

    Reaction.prototype.like = function(type, id) {
        var reaction = this;
        if (reaction.isLike == true) return;
        if (window.localStorage.access_token == undefined || window.localStorage.access_token == null) {
            alert("请先登录！");
            return;
        }
        var request_url = '';
        if (type == 'issue') {
            request_url = 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues/' + id + '/reactions';
        } else if (type == 'comment') {
            request_url = 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues/comments/' + id + '/reactions';
        }
        $.ajax({
            type: "post",
            url: request_url,
            headers: {
                Authorization: 'token ' + window.localStorage.access_token,
                Accept: 'application/vnd.github.squirrel-girl-preview+json'
            },
            data: JSON.stringify({
                "content": "heart"
            }),
            success: function() {
                reaction.num += 1;
                reaction.isLike = true;
                reaction.show(id);
            }
        });
    }

    Reaction.prototype.getNum = function(type, id) {
        var reaction = this;
        var request_url = '';
        if (type == 'issue') {
            request_url = 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues/' + id + '/reactions';
        } else if (type == 'comment') {
            request_url = 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues/comments/' + id + '/reactions';
        }
        $.ajax({
            type: "get",
            url: request_url + '?content=heart',
            headers: {
                Accept: 'application/vnd.github.squirrel-girl-preview+json'
            },
            success: function(data) {
                for (var i in data) {
                    if (data[i].user.login == window.localStorage.name) {
                        reaction.isLike = true;
                    }
                }
                reaction.num = data.length;
                reaction.show(type, id);
            }
        });
    }

    Reaction.prototype.show = function(type, id) {
        var reaction = this;
        if (reaction.isLike == false) {
            document.getElementById(id).innerHTML = '<svg style="height:20px;float:left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5zM17 12c-3.9 0-7 3.1-7 7 0 5.1 3.2 8.5 15 18.1 11.8-9.6 15-13 15-18.1 0-3.9-3.1-7-7-7-3.5 0-5.4 2.1-6.9 3.8L25 17.1l-1.1-1.3C22.4 14.1 20.5 12 17 12z"></path></svg>';
        } else if (reaction.isLike == true) {
            document.getElementById(id).innerHTML = '❤️';
        }
        document.getElementById(id).innerHTML += reaction.num;
        document.getElementById(id).onclick = function() {
            reaction.like(type, id);
        };
    }

    var commentItem = function() {
        this.reaction = new Reaction();
    }

    var Comment = function() {
        this.login = false;
        this.item = [];
    }

    Comment.prototype.send = function() {
        var comment = this;
        var input = document.getElementById('comment-input').value;
        var access_token = window.localStorage.access_token;
        $.ajax({
            type: "post",
            url: 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues/' + self.options.id + '/comments',
            headers: {
                Authorization: 'token ' + access_token,
                Accept: 'application/vnd.github.squirrel-girl-preview, application/vnd.github.html+json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "body": input
            }),
            dataType: "json",
            success: function(data) {
                if (data.id != undefined) {
                    document.getElementById('comment-input').value = "";
                    comment.addComment(data);
                    document.getElementById('comments-num').innerHTML++;
                }
            }
        });
    }

    Comment.prototype.init = function() {
        var comment = this;
        comment.checkIsLogin();
        $.ajax({
            type: 'get',
            headers: {
                Accept: 'application/vnd.github.squirrel-girl-preview, application/vnd.github.html+json, application/x-www-form-urlencoded',
            },
            url: 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues/' + self.options.id + '/comments?page=' + self.options.page + '&per_page=10',
            success: function(data) {
                document.getElementById('comment-list').innerHTML = "";
                for (var i in data) {
                    comment.addComment(data[i]);
                }
            }
        });

        var login = document.getElementById('login');
        if (comment.login == false) {
            login.innerHTML = '<a class="gitment-editor-login-link" href="javascript:blog.content.comments.log()">登入</a> with GitHub';
        } else {
            login.innerHTML = '<a class="gitment-editor-login-link" href="javascript:blog.content.comments.logout()">登出</a>';
        }

        var editor_content = document.getElementById('write-field');
        if (comment.login == false) {
            editor_content.innerHTML = '<textarea placeholder="(发表评论)" title="请登入以发表评论" disabled id="comment-input"></textarea>';
            $('.gitment-editor-submit').attr("disabled", true);
        } else {
            editor_content.innerHTML = '<textarea placeholder="(发表评论)" id="comment-input"></textarea>';
            $('.gitment-editor-submit').attr("disabled", false);
        }

        $('#editComment').attr("onclick", "blog.content.comments.edit()");
        $('#preview').attr("onclick", "blog.content.comments.preview()");
        $('.gitment-editor-submit').attr("onclick", "blog.content.comments.send()");
    }

    Comment.prototype.addComment = function(data) {
        var comment = new commentItem();
        data.created_at = self.utc2localTime(data.created_at);
        document.getElementById('comment-list').innerHTML += '<li class="gitment-comment">' + '<a class="gitment-comment-avatar" href=' + data.user.html_url + ' target="_blank">' + '<img class="gitment-comment-avatar-img" src=' + data.user.avatar_url + '></a>' + '<div class="gitment-comment-main"><div class="gitment-comment-header">' + '<a class="gitment-comment-name" href=' + data.user.html_url + ' target="_blank">' + data.user.login + '</a> 评论于 ' + '<span>' + data.created_at + '</span>' + '<div style="float:right;cursor:pointer" id="' + data.id + '"></div>' + '</div><div class="gitment-comment-body gitment-markdown">' + data.body_html + '</div></div>';
        comment.reaction.getNum('comment', data.id);
        this.item.push(comment);
    }

    Comment.prototype.checkIsLogin = function() {
        var comment = this;
        if (window.localStorage.access_token != undefined) {
            this.login = true;
        }
        var avatar = document.getElementById('avatar');
        if (this.login == true) {
            $.ajax({
                type: "get",
                url: 'https://api.github.com/user?access_token=' + window.localStorage.access_token,
                success: function(data) {
                    window.localStorage.setItem('user_avatar_url', data.avatar_url);
                    window.localStorage.setItem('user_url', data.html_url);
                    window.localStorage.setItem('name', data.login);
                    avatar.innerHTML = '<a class="gitment-comment-avatar" href=' + window.localStorage.user_url + ' target="_blank">' + '<img class="gitment-comment-avatar-img" src=' + window.localStorage.user_avatar_url + '></a>';
                },
                error: function() {
                    console.log("用户信息过期，退出登录状态");
                    comment.logout();
                }
            });
        } else {
            avatar.innerHTML = '<a class="gitment-editor-avatar" href="javascript:blog.content.comments.log()" title="login with GitHub">' + '<svg class="gitment-github-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M25 10c-8.3 0-15 6.7-15 15 0 6.6 4.3 12.2 10.3 14.2.8.1 1-.3 1-.7v-2.6c-4.2.9-5.1-2-5.1-2-.7-1.7-1.7-2.2-1.7-2.2-1.4-.9.1-.9.1-.9 1.5.1 2.3 1.5 2.3 1.5 1.3 2.3 3.5 1.6 4.4 1.2.1-1 .5-1.6 1-2-3.3-.4-6.8-1.7-6.8-7.4 0-1.6.6-3 1.5-4-.2-.4-.7-1.9.1-4 0 0 1.3-.4 4.1 1.5 1.2-.3 2.5-.5 3.8-.5 1.3 0 2.6.2 3.8.5 2.9-1.9 4.1-1.5 4.1-1.5.8 2.1.3 3.6.1 4 1 1 1.5 2.4 1.5 4 0 5.8-3.5 7-6.8 7.4.5.5 1 1.4 1 2.8v4.1c0 .4.3.9 1 .7 6-2 10.2-7.6 10.2-14.2C40 16.7 33.3 10 25 10z"></path></svg>' + '</a></div>';
        }
    }

    Comment.prototype.preview = function() {
        $('#editComment').removeClass('gitment-selected');
        $('#preview').addClass('gitment-selected');
        $('.gitment-editor-write-field').addClass('gitment-hidden');
        $('.gitment-editor-preview-field').removeClass('gitment-hidden');
        var preview_content = document.getElementById('preview-content');
        var comment_input = document.getElementById('comment-input').value;
        if (comment_input == "") {
            preview_content.innerHTML = '（没有预览）';
        } else {
            preview_content.innerHTML = '预览加载中';
            $.ajax({
                type: "post",
                url: 'https://api.github.com/markdown',
                headers: {
                    Accept: 'text/html, application/vnd.github.squirrel-girl-preview, application/vnd.github.html+json, application/x-www-form-urlencoded',
                    'Content-Type': 'text/html'
                },
                data: JSON.stringify({
                    mode: 'gfm',
                    text: comment_input
                }),
                dataType: "text/html",
                success: function(message) {
                    preview_content.innerHTML = message.responseText;
                },
                error: function(message) {
                    preview_content.innerHTML = message.responseText;
                }
            });
        }
    }

    Comment.prototype.edit = function() {
        $('#editComment').addClass('gitment-selected');
        $('#preview').removeClass('gitment-selected');
        $('.gitment-editor-write-field').removeClass('gitment-hidden');
        $('.gitment-editor-preview-field').addClass('gitment-hidden');
    }

    Comment.prototype.log = function() {
        var url = 'https://github.com/login/oauth/authorize?client_id=' + config.client_id + '&scope=public_repo&state=' + window.location.href;
        window.location.href = url;
    }

    Comment.prototype.logout = function() {
        this.login = false;
        window.localStorage.clear();
        this.init();
    }

    var Article = function() {
        this.comments = new Comment();
        this.page = new Pages();
        this.reaction = new Reaction();
        this.comment_url = "";
    }

    Article.prototype.init = function() {
        var article = this;
        if (self.options.token != undefined && self.options.token != null) {
            window.localStorage.clear();
            window.localStorage.setItem("access_token", self.options.token);
            history.replaceState(null, config.title, 'content.html?id=' + self.options.id);
        }
        article.comment_url = 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues/' + self.options.id + '/comments';
        article.page.getNum(article.comment_url);
        $.ajax({
            type: 'get',
            headers: {
                Accept: 'application/vnd.github.squirrel-girl-preview, application/vnd.github.html+json, application/x-www-form-urlencoded',
            },
            url: 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues/' + self.options.id,
            success: function(data) {
                document.getElementById('title').innerHTML = data.title;
                document.getElementsByTagName("title")[0].innerText = data.title + "-" + config.title;
                data.created_at = self.utc2localTime(data.created_at);
                document.getElementById('instruction').innerHTML = data.created_at;
                document.getElementById('content').innerHTML = data.body_html;
                var labels = document.getElementById('labels');
                for (var i in data.labels) {
                    labels.innerHTML += '<a href="issue_per_label.html?label=' + data.labels[i].name + '"># ' + data.labels[i].name + '</a>';
                }
                labels.innerHTML += '<div style="float:right;cursor:pointer" id="' + self.options.id + '"></div>';
                article.reaction.getNum('issue', self.options.id);
                article.comments.init();
            }
        });
    }

    var Issue = function() {
        this.issue_url = '';
        this.issue_perpage_url = '';
        this.issue_search_url = '';
        this.page = new Pages();
    }

    Issue.prototype.addItem = function(data) {
        document.getElementById('issue-list').innerHTML = '';
        for (var i in data) {
            var labels_content = '';
            for (var j in data[i].labels) {
                labels_content += '<li><a href=issue_per_label.html?label=' + data[i].labels[j].name + '>' + data[i].labels[j].name + '</a></li>';
            }
            data[i].body = data[i].body.replace(/<.*?>/g, "");
            data[i].created_at = self.utc2localTime(data[i].created_at);
            document.getElementById('issue-list').innerHTML += '<li><p class="date">' + data[i].created_at + '</p><h4 class="title"><a href="content.html?id=' + data[i].number + '">' + data[i].title + '</a></h4><div class="excerpt"><p class="issue">' + data[i].body + '</p></div>' + '<ul class="meta"><li>' + data[i].user.login + '</li>' + labels_content + '</ul></li>';
        }
    }

    Issue.prototype.show = function(request_url) {
        var issue = this;
        $.ajax({
            type: 'get',
            url: request_url + 'page=' + self.options.page + '&per_page=10',
            success: function(data) {
                if (self.options.q == undefined || self.options.q == null) {
                    if (data.length == 0) {
                        document.getElementById('issue-list').innerHTML = '这个人很勤快但这里什么都还没写~';
                        $('.footer').css('position', 'absolute');
                    } else {
                        issue.addItem(data);
                    }
                } else {
                    if (data.items.length == 0) {
                        window.location.href = '404.html';
                    } else {
                        issue.addItem(data.items);
                    }
                    var html = document.getElementById('issue-list').innerHTML;
                    var newHtml = html.replaceAll(self.options.q, '<font style="background-color:yellow;">' + self.options.q + '</font>');
                    document.getElementById('issue-list').innerHTML = newHtml;
                }
            }
        });
    }

    Issue.prototype.init = function() {
        if (self.options.label == undefined) {
            if (self.options.q == undefined) {
                this.issue_url = 'https://api.github.com/repos/' + config.name + '/' + config.repo;
                this.issue_perpage_url = 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues?creator=' + config.name + '&';
            } else {
                this.search(self.options.q);
            }
        } else {
            this.issue_url = 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues?labels=' + self.options.label;
            this.issue_perpage_url = 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues?creator=' + config.name + '&labels=' + self.options.label + '&';
            document.getElementById('title').innerHTML = self.options.label;
            $.ajax({
                type: 'get',
                headers: {
                    Accept: 'application/vnd.github.symmetra-preview+json',
                },
                url: 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/labels/' + self.options.label,
                success: function(data) {
                    document.getElementById('instruction').innerHTML = data.description;
                }
            });
        }
        this.page.getNum(this.issue_url);
        this.show(this.issue_perpage_url);
    }

    Issue.prototype.search = function(search) {
        search = encodeURI(search);
        this.issue_url = 'https://api.github.com/search/issues?q=' + search + ' author:' + config.name + '+in:title,body';
        this.issue_perpage_url = 'https://api.github.com/search/issues?q=' + search + ' author:' + config.name + '+in:title,body&';
    }

    var Buttons = function() {

}

    Buttons.prototype.init = function() {
        $('.navi-button').click(function() {
            if ($('.main').css("transform") == "matrix(1, 0, 0, 1, 0, 0)") {
                $('.main').css("transform", "translateX(-150px)");
                $('.main-navication span').css("opacity", "1");
                $('.main-navication').css("opacity", "1");
                $('.main-navication span').css("transform", "translateX(-10px)");
                $('.navi-button').css("transform", "translateX(-150px)");
                $('.Totop').css("transform", "translateX(-150px)");
                $('.search').css("transform", "translateX(-150px)");
                $('.search-input').css("transform", "translateX(-150px)");
            } else {
                $('.main').css("transform", "translateX(0)");
                $('.main-navication span').css("opacity", "0");
                $('.main-navication').css("opacity", "0");
                $('.main-navication span').css("transform", "translateX(-50px)");
                $('.navi-button').css("transform", "translateX(0px)");
                $('.Totop').css("transform", "translateX(0px)");
                $('.search').css("transform", "translateX(0px)");
                $('.search-input').css("transform", "translateX(0px)");
            }
        });

        $('.Totop').click(function() {
            $('html,body').animate({
                scrollTop: '0px'
            },
            600);
        });

        $('.search').click(function() {
            $(".search-input").css('z-index', 99);
            $(".search-input").css("width", '300px');
            $(".search-input").focus();
        });

        $('.search-input').bind('keypress',
        function(event) {
            if (event.keyCode == "13" && $('.search-input').val() != "") {
                window.location.href = 'issue_per_label.html?q=' + $('.search-input').val();
            }
        })

        window.onscroll = function() {
            if ($(document).scrollTop() >= 0.6 * document.documentElement.clientHeight) {
                $('.Totop').css('opacity', 1);
            } else {
                $('.Totop').css('opacity', 0);
            }
        }
    }

    self.init = function() {
        self.info = new Info();
        self.info.init();
        if (self.options.id != null && self.options.id != undefined) {
            self.content = new Article();
            self.content.init();
        } else {
            self.content = new Issue();
            self.content.init();
        }
        self.menu = new Menu();
        self.menu.show();
        self.footer = new Footer();
        self.footer.show();
        self.button = new Buttons();
        self.button.init();
    }

    self.init();
}

var blog = new gitblog();
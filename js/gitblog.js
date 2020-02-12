var gitblog = function(config) {
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

    self.set = function() {
        if (self.getUrlParam('id') != undefined) {
            self.options.id = parseInt(self.getUrlParam('id'));
        }
        if (self.getUrlParam('label') != undefined) {
            self.options.label = self.getUrlParam('label');
        }
        if (self.getUrlParam('q') != undefined) {
            self.options.q = self.getUrlParam('q');
        }
        if (self.getUrlParam('page') != undefined) {
            self.options.page = parseInt(self.getUrlParam('page'));
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
    }

    self.set();

    self.utc2localTime = function(time) {
        var time_string_utc_epoch = Date.parse(time);
        var unixTimestamp = new Date(time_string_utc_epoch);
        var year = unixTimestamp.getFullYear();
        var month = unixTimestamp.getMonth() + 1;
        var date = unixTimestamp.getDate();
        var hour = unixTimestamp.getHours();
        var minute = unixTimestamp.getMinutes();
        var second = unixTimestamp.getSeconds();
        hour = (hour<10)?'0'+hour:hour;
        minute = (minute<10)?'0'+minute:minute;
        second = (second<10)?'0'+second:second;
        return year+'年'+month+'月'+date+'日'+' '+hour+':'+minute+':'+second;
    }

    String.prototype.replaceAll = function(a, b) {
        return this.replace(new RegExp(a, 'gm'), b);
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

    Menu.prototype = {
        searchOnblur: function() {
            if ($('.search-input').val() == "") {
                $(".search-input").css("width", '42px');
                $(".search-input").css("z-index", -1);
            }
        },
        show: function() {
            var menu = this;
            for(var name in config.menu) {
                document.getElementById("menu").innerHTML += '<li><a href=' + config.menu[name] + '><span>' + name + '</span></a></li>';
            }
            if (Object.keys(config.friends).length != 0) {
                var menu_friend = document.getElementById("friends");
                menu_friend.innerHTML = '<li><text style="font-zise:14px"><span style="color: white;transform:translateX(4px)">友链：</span></text></li>';
                for (var name in config.friends) {
                    menu_friend.innerHTML += '<li><a href=' + config.friends[name] + ' target="_blank"><span>' + name + '</span></a></li>';
                }
            }
            $(".search-input").on("blur",
            function() {
                menu.searchOnblur();
            });
        }
    }

    var Icon = function(options, name, left) {
        this.icon_src = options.icon_src;
        this.href = options.href;
        this.hidden_img = options.hidden_img;
        this.width = options.width;
        this.name = name;
        this.position = left;
    }

    Icon.prototype = {
        init: function() {
            var icon = this;
            if(icon.href != undefined && icon.href != null) {
                document.getElementById("div_"+icon.name).innerHTML += '<a target="_blank" title="' + icon.name + '" id="icon_' + icon.name + '" href="' + icon.href + '"><img src="' + icon.icon_src + '" style="width:50px;margin-left:10px;margin-right:10px"></a>';
            } else {
                document.getElementById("div_"+icon.name).innerHTML += '<img src="' + icon.icon_src + '" title="' + icon.name + '" id="icon_' + icon.name + '" style="width:50px;margin-left:10px;margin-right:10px;cursor:pointer">';
            }
            if (icon.hidden_img != undefined && icon.hidden_img != null) {
                document.getElementById("div_"+icon.name).innerHTML += '<img id="' + icon.name + '" src="' + icon.hidden_img + '" style="width: ' + icon.width + 'px; position: absolute; left: calc(50% - ' + this.position + 'px); bottom: 180px; transition: all 0.3s ease 0s; box-shadow: rgb(149, 165, 166) 0px 0px 5px; transform: translateY(-20px); z-index: -1; opacity: 0">';
                $('#icon_' + icon.name).mouseover(function() {
                    icon.changeIcon(icon.name, 'show');
                });
                $('#icon_' + icon.name).mouseout(function() {
                    icon.changeIcon(icon.name, 'hidden');
                });
            }
        },
        changeIcon: function(id, action) {
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
    }

    var Footer = function() {
        this.page = new Pages();
        this.icons = [];
        this.icon_num = 0;
        this.content = 'Powered by <a href="https://github.com/imuncle/gitblog" target="_blank" style="color: aquamarine;text-decoration:none;border-bottom: 1px solid #79f8d4;">gitblog</a>';
    }

    Footer.prototype = {
        showIcon: function() {
            var footer = this;
            for (var i in config.icons) {
                if (config.icons[i].icon_src != undefined && config.icons[i].icon_src != null) {
                    document.getElementById('icon').innerHTML += '<div style="padding-inline-start: 0;margin: 0" id="div_'+i+'"></div>';
                }
            }
            for (var i in config.icons) {
                if (config.icons[i].icon_src != undefined && config.icons[i].icon_src != null) {
                    var left = Object.keys(config.icons).length * 35 - 70 * footer.icon_num + config.icons[i].width / 2 - 35;
                    var icon = new Icon(config.icons[i], i, left);
                    icon.init();
                    footer.icons.push(icon);
                    footer.icon_num++;
                }
            }
        },
        show: function() {
            document.getElementById('footer').innerHTML += this.content;
            this.showIcon();
        }
    }

    var Pages = function() {
        this.page = 1;
        this.pages = 1;
        this.itemNum = 0;
        this.pageLimit = 7;
    }

    Pages.prototype = {
        getNum: function(request_url) {
            var page = this;
            if (self.options.page != null && self.options.page != undefined) {
                page.page = self.options.page;
            }
            $.ajax({
                type: 'get',
                url: request_url,
                success: function(data) {
                    if (self.options.label != null && self.options.label != undefined) {
                        page.itemNum = data.length;
                    } else if(self.options.q != null && self.options.q != undefined) {
                        page.itemNum = data.total_count;
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
        },
        show: function() {
            var page = this;
            $('#pages').css('display', 'inline-block');
            document.getElementById('pages').innerHTML = '<li id="last_page"><a id="last" style="cursor: pointer">«</a></li>';
            if (page.pages <= page.pageLimit) {
                for (var i = 1; i <= page.pages; i++) {
                    document.getElementById('pages').innerHTML += '<li><a id="page' + i + '" style="cursor:pointer">' + i + '</a></li>';
                }
            } else {
                if (page.page >= 5) {
                    document.getElementById('pages').innerHTML += '<li><a id="page1" style="cursor:pointer">1</a></li>';
                    document.getElementById('pages').innerHTML += '<li><a style="cursor:pointer;pointer-events: none;">...</a></li>';
                    document.getElementById('pages').innerHTML += '<li><a id="page' + (page.page - 1) + '" style="cursor:pointer">' + (page.page - 1) + '</a></li>';
                    document.getElementById('pages').innerHTML += '<li><a id="page' + page.page + '" style="cursor:pointer">' + page.page + '</a></li>';
                } else {
                    for (var i = 1; i <= page.page; i++) {
                        document.getElementById('pages').innerHTML += '<li><a id="page' + i + '" style="cursor:pointer">' + i + '</a></li>';
                    }
                }
                if (page.page <= page.pages - 4) {
                    document.getElementById('pages').innerHTML += '<li><a id="page' + (page.page + 1) + '" style="cursor:pointer">' + (page.page + 1) + '</a></li>';
                    document.getElementById('pages').innerHTML += '<li><a style="cursor:pointer;pointer-events: none;">...</a></li>';
                    document.getElementById('pages').innerHTML += '<li><a id="page' + page.pages + '" style="cursor:pointer">' + page.pages + '</a></li>';
                } else {
                    for (var i = page.page + 1; i <= page.pages; i++) {
                        document.getElementById('pages').innerHTML += '<li><a id="page' + i + '" style="cursor:pointer">' + i + '</a></li>';
                    }
                }
            }
            document.getElementById('pages').innerHTML += '<li id="next_page"><a id="next" style="cursor: pointer">»</a></li>';
            for (var i = 1; i <= page.pages; i++) {
                if (self.options.label != undefined) {
                    $('#page' + i).click(function() {
                        window.location.href = "?label=" + self.options.label + "&page=" + this.innerHTML;
                    });
                } else if (self.options.id != undefined) {
                    $('#page' + i).click(function() {
                        window.location.href = "?id=" + self.options.id + "&page=" + this.innerHTML;
                    });
                } else if(self.options.q != undefined) {
                    $('#page' + i).click(function() {
                        window.location.href = "?q=" + self.options.q + "&page=" + this.innerHTML;
                    });
                } else {
                    $('#page' + i).click(function() {
                        window.location.href = "?page=" + this.innerHTML;
                    });
                }
                if (i == page.page) {
                    $('#page' + i).addClass('active');
                } else {
                    $('#page' + i).removeClass('active');
                }
            }
            if (page.page == 1) {
                $('#last_page').css('pointer-events', 'none');
                $('#next_page').css('pointer-events', 'auto');
            } else if (page.page == page.pages) {
                $('#last_page').css('pointer-events', 'auto');
                $('#next_page').css('pointer-events', 'none');
            }
            document.getElementById('last').onclick = function() {
                page.last();
            }
            document.getElementById('next').onclick = function() {
                page.next();
            }
        },
        last: function() {
            this.page--;
            if (self.options.label != undefined) {
                window.location.href = '?label=' + self.options.label + '&page=' + this.page;
            } else if (self.options.id != undefined && self.options.id != null) {
                window.location.href = '?id=' + self.options.id + '&page=' + this.page;
            } else {
                window.location.href = '?page=' + this.page;
            }
        },
        next: function() {
            this.page++;
            if (self.options.label != undefined) {
                window.location.href = '?label=' + self.options.label + '&page=' + this.page;
            } else if (self.options.id != undefined && self.options.id != null) {
                window.location.href = '?id=' + self.options.id + '&page=' + this.page;
            } else {
                window.location.href = '?page=' + this.page;
            }
        }
    }

    var Reaction = function() {
        this.num = 0;
        this.isLike = false;
    }

    Reaction.prototype = {
        like: function(type, id) {
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
                    Authorization: 'Basic ' + window.localStorage.authorize,
                    Accept: 'application/vnd.github.squirrel-girl-preview+json'
                },
                data: JSON.stringify({
                    "content": "heart"
                }),
                success: function() {
                    reaction.num += 1;
                    reaction.isLike = true;
                    reaction.show(type, id);
                }
            });
        },
        getNum: function(type, id) {
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
        },
        show: function(type, id) {
            var reaction = this;
            if (reaction.isLike == false) {
                document.getElementById(id).innerHTML = '<img src="images/heart.svg" style="height:20px;float:left">';
            } else if (reaction.isLike == true) {
                document.getElementById(id).innerHTML = '❤️';
            }
            document.getElementById(id).innerHTML += reaction.num;
            document.getElementById(id).onclick = function() {
                reaction.like(type, id);
            };
        }
    }

    var commentItem = function() {
        this.reaction = new Reaction();
    }

    var Comment = function() {
        this.login = false;
        this.item = [];
    }

    Comment.prototype = {
        send: function() {
            var comment = this;
            var input = document.getElementById('comment-input').value;
            $.ajax({
                type: "post",
                url: 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues/' + self.options.id + '/comments',
                headers: {
                    Authorization: 'Basic ' + window.localStorage.authorize,
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
        },
        init: function() {
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
                login.innerHTML = '<a class="gitment-editor-login-link" id="log">登入</a> with GitHub';
            } else {
                login.innerHTML = '<a class="gitment-editor-login-link" id="log">登出</a>';
            }

            document.getElementById('log').onclick = function() {
                if (comment.login == false) {
                    comment.log();
                } else {
                    comment.logout();
                }
            }

            var editor_content = document.getElementById('write-field');
            if (comment.login == false) {
                editor_content.innerHTML = '<textarea placeholder="(发表评论)" title="请登入以发表评论" disabled id="comment-input"></textarea>';
                $('.gitment-editor-submit').attr("disabled", true);
            } else {
                editor_content.innerHTML = '<textarea placeholder="(发表评论)" id="comment-input"></textarea>';
                $('.gitment-editor-submit').attr("disabled", false);
            }

            $('#editComment').click(function() {
                comment.edit();
            });
            $('#preview').click(function() {
                comment.preview();
            });
            $('.gitment-editor-submit').click(function() {
                comment.send();
            });
        },
        addComment: function(data) {
            var comment = new commentItem();
            data.created_at = self.utc2localTime(data.created_at);
            document.getElementById('comment-list').innerHTML += '<li class="gitment-comment">' + '<a class="gitment-comment-avatar" href=' + data.user.html_url + ' target="_blank">' + '<img class="gitment-comment-avatar-img" src=' + data.user.avatar_url + '></a>' + '<div class="gitment-comment-main"><div class="gitment-comment-header">' + '<a class="gitment-comment-name" href=' + data.user.html_url + ' target="_blank">' + data.user.login + '</a> 评论于 ' + '<span>' + data.created_at + '</span>' + '<div style="float:right;cursor:pointer" id="' + data.id + '"></div>' + '</div><div class="gitment-comment-body gitment-markdown">' + data.body_html + '</div></div>';
            comment.reaction.getNum('comment', data.id);
            this.item.push(comment);
        },
        checkIsLogin: function() {
            var comment = this;
            if (window.localStorage.access_token != undefined) {
                this.login = true;
            }
            var avatar = document.getElementById('avatar');
            if (this.login == true) {
                $.ajax({
                    type: "get",
                    async: false,
                    url: 'https://api.github.com/user?access_token=' + window.localStorage.access_token,
                    success: function(data) {
                        window.localStorage.setItem('user_avatar_url', data.avatar_url);
                        window.localStorage.setItem('user_url', data.html_url);
                        window.localStorage.setItem('name', data.login);
                        avatar.innerHTML = '<a class="gitment-comment-avatar" href=' + window.localStorage.user_url + ' target="_blank">' + '<img class="gitment-comment-avatar-img" src=' + window.localStorage.user_avatar_url + '></a>';
                        window.localStorage.setItem('authorize', btoa(data.login + ':' + window.localStorage.access_token));
                    },
                    error: function() {
                        console.log("用户信息过期，退出登录状态");
                        comment.logout();
                    }
                });
            } else {
                avatar.innerHTML = '<a class="gitment-editor-avatar" id="gitment-avatar" title="login with GitHub">' + '<img src="images/gitment-github-icon.svg" class="gitment-github-icon" style="width:44px">' + '</a></div>';
                document.getElementById('gitment-avatar').onclick = function() {
                    comment.log();
                }
            }
        },
        preview: function() {
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
        },
        edit: function() {
            $('#editComment').addClass('gitment-selected');
            $('#preview').removeClass('gitment-selected');
            $('.gitment-editor-write-field').removeClass('gitment-hidden');
            $('.gitment-editor-preview-field').addClass('gitment-hidden');
        },
        log: function() {
            window.location.href = 'https://github.com/login/oauth/authorize?client_id=' + config.client_id + '&scope=public_repo&state=' + window.location.href;
        },
        logout: function() {
            this.login = false;
            window.localStorage.clear();
            this.init();
        }
    }

    var Article = function() {
        this.comments = new Comment();
        this.page = new Pages();
        this.reaction = new Reaction();
        this.comment_url = "";
    }

    Article.prototype = {
        init: function() {
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
                    article.comments.init();
                    article.reaction.getNum('issue', self.options.id);
                }
            });
        }
    }

    var Issue = function() {
        this.issue_url = '';
        this.issue_perpage_url = '';
        this.issue_search_url = '';
        this.author = '';
        this.creator = '',
        this.state = '';
        this.page = new Pages();
    }

    Issue.prototype = {
        getTags: function() {
            $.ajax({
                type: 'get',
                url: 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/labels',
                success: function(data) {
                    for (var i in data) {
                        document.getElementById('tags').innerHTML += '<a href="issue_per_label.html?label=' + data[i].name + '">' + data[i].name + '</a>';
                    }
                },
            });
        },
        addItem: function(data) {
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
        },
        show: function(request_url) {
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
                        var newHtml;
                        if(self.options.q != '')
                            newHtml = html.replaceAll(self.options.q, '<font style="background-color:yellow;">' + self.options.q + '</font>');
                        else
                            newHtml = html;
                        document.getElementById('issue-list').innerHTML = newHtml;
                    }
                }
            });
        },
        init: function() {
            if(config.filter.creator != undefined && config.filter.creator != null) {
                if(config.filter.creator == 'all') {
                    this.author = '';
                    this.creator = '';
                } else {
                    var authors= new Array();
                    authors = config.filter.creator.split(",");
                    for(var i in authors) {
                        this.author += 'author:' + authors[i] + '+';
                        this.creator += 'creator=' + authors[i] + '&';
                    }
                }
            } else {
                this.author = '';
                this.creator = '';
            }
            if(config.filter.state != undefined && config.filter.state != null) {
                this.state = config.filter.state;
            } else {
                this.state = 'all';
            }
            if (self.options.label == undefined) {
                if (self.options.q == undefined) {
                    this.issue_url = 'https://api.github.com/repos/' + config.name + '/' + config.repo;
                    this.issue_perpage_url = 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues?' + this.creator + 'state=' + this.state + '&';
                } else {
                    this.search(self.options.q);
                }
            } else {
                this.issue_url = 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues?' + this.creator + 'labels=' + self.options.label + '&state=' + this.state;
                this.issue_perpage_url = 'https://api.github.com/repos/' + config.name + '/' + config.repo + '/issues?' + this.creator + 'labels=' + self.options.label + '&state=' + this.state + '&';
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
            this.getTags();
        },
        search: function(search) {
            search = encodeURI(search);
            this.issue_url = 'https://api.github.com/search/issues?q=' + search + ' ' + this.author + 'in:title,body+repo:' + config.name + '/' + config.repo + '+state:' + this.state;
            this.issue_perpage_url = 'https://api.github.com/search/issues?q=' + search + ' ' + this.author + 'in:title,body+repo:' + config.name + '/' + config.repo + '+state:' + this.state + '&';
        }
    }

    var Buttons = function() {}

    Buttons.prototype = {
        getByClass: function(Parent, Class){
            var result=[];
            var ele=Parent.getElementsByTagName('*');
            for(var i=0;i<ele.length;i++){
                if(ele[i].className==Class)
                {
                    result.push(ele[i]);
                }
            }
            return result;
        },
        init: function() {
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
                }
            });

            this.getByClass(document.getElementsByTagName("body")[0], "main")[0].addEventListener("mousedown",function(){
                if($('.main').css("transform") != "matrix(1, 0, 0, 1, 0, 0)") {
                    $('.main').css("transform", "translateX(0)");
                    $('.main-navication span').css("opacity", "0");
                    $('.main-navication').css("opacity", "0");
                    $('.main-navication span').css("transform", "translateX(-50px)");
                    $('.navi-button').css("transform", "translateX(0px)");
                    $('.Totop').css("transform", "translateX(0px)");
                    $('.search').css("transform", "translateX(0px)");
                    $('.search-input').css("transform", "translateX(0px)");
                }
            },false);

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

    console.log('\n' + ' %c Gitblog' + ' %c https://github.com/imuncle/gitblog \n', 'color: #fadfa3; background: #030307; padding:5px 0;', 'background: #fadfa3; padding:5px 0;');
}

$.ajax({
    type: 'get',
    headers: {
        Accept: 'application/json',
    },
    url: 'config.json',
    success: function(data) {
        new gitblog(data).init();
    }
});
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

PageInit();
var IsLogIn = false;
var issue_num;
var page = getUrlParam('page');
if(page == undefined || page == null) page = 1;

var code = getUrlParam('code');
var redirect_url = getUrlParam('state');
if(code != undefined && redirect_url != undefined) {
    window.location.href = config.server_link+"?code="+code+"&redirect_url="+redirect_url+"&client_id="+config.client_id+"&client_secret="+config.client_secret;
}

function PageInit() {
    $('#title').text(config.title);
    $('#instruction').text(config.instruction);
    document.getElementsByTagName("title")[0].innerText = config.title;
    
    if(Object.keys(config.friends).length != 0) {
        var menu_friend = document.getElementById("friends");
        menu_friend.innerHTML = '<li><a><span style="color: white;transform:translateX(4px)">友链：</span></a></li>';
        for(var name in config.friends) {
            menu_friend.innerHTML += '<li><a href='+config.friends[name]+' target="_blank"><span>'+name+'</span></a></li>';
        }
    }
    GetMenu();
}

$('.navi-button').click(function(){
    if($('.main').css("transform") == "matrix(1, 0, 0, 1, 0, 0)")
    {
        $('.main').css("transform","translateX(-150px)");
        $('.main-navication span').css("opacity","1");
        $('.main-navication').css("opacity","1");
        $('.main-navication span').css("transform","translateX(-10px)");
        $('.navi-button').css("transform","translateX(-150px)");
        $('.Totop').css("transform","translateX(-150px)");
        $('.search').css("transform","translateX(-150px)");
        $('.search-input').css("transform","translateX(-150px)");
    }else {
        $('.main').css("transform","translateX(0)");
        $('.main-navication span').css("opacity","0");
        $('.main-navication').css("opacity","0");
        $('.main-navication span').css("transform","translateX(-50px)");
        $('.navi-button').css("transform","translateX(0px)");
        $('.Totop').css("transform","translateX(0px)");
        $('.search').css("transform","translateX(0px)");
        $('.search-input').css("transform","translateX(0px)");
    }
});

$('.Totop').click(function() {
    $('html,body').animate(
        { scrollTop: '0px' }, 600
    );
});

$('.search').click(function() {
    $(".search-input").css('z-index',99);
    $(".search-input").css("width",'300px');
    $(".search-input").focus();
});

function searchOnblur(){
    if($('.search-input').val() == "")
    {
        $(".search-input").css("width",'42px');
        $(".search-input").css("z-index",-1);
    }
}

$('.search-input').bind('keypress', function (event) { 
    if (event.keyCode == "13" && $('.search-input').val() != "") {
        window.location.href = 'issue_per_label.html?q='+$('.search-input').val();
    }
})

function WeChart(command)
{
  if(command == "show") {
    $('#wechart-qrcode').css('z-index','99');
    $('#wechart-qrcode').css("opacity","1");
    $('#wechart-qrcode').css("transform","translateY(0)");
  } else if(command == "hide")
  {
    $('#wechart-qrcode').css('z-index','-1');
    $('#wechart-qrcode').css("opacity","0");
    $('#wechart-qrcode').css("transform","translateY(-20px)");
  }
}

function articlePage() {
    var id = getUrlParam('id');
    var token = getUrlParam('access_token');
    if(token != undefined && token != null) {
        window.localStorage.clear();
        window.localStorage.setItem("access_token",token);
        history.replaceState(null, config.title, 'content.html?id='+id);
    }
    getPageNum('https://api.github.com/repos/'+config.name+'/'+config.repo+'/issues/'+id+'/comments');
    $.ajax({
        type : 'get',
        headers : {
            Accept: 'application/vnd.github.squirrel-girl-preview, application/vnd.github.html+json, application/x-www-form-urlencoded',
        },
        url : 'https://api.github.com/repos/'+config.name+'/'+config.repo+'/issues/'+id,
        success : function(data) {
            document.getElementById('title').innerHTML = data.title;
            document.getElementsByTagName("title")[0].innerText = data.title+"-大叔的小站";
            data.created_at = utc2localTime(data.created_at);
            document.getElementById('instruction').innerHTML = data.created_at;
            document.getElementById('content').innerHTML = data.body_html;
            var labels = document.getElementById('labels');
            for(var i=0;i<data.labels.length;i++) {
                labels.innerHTML += '<a href="issue_per_label.html?label='+data.labels[i].name+'"># '+data.labels[i].name+'</a>';
            }
            commentListInit(data.comments,id);
        }
    });
    checkIsLogin();
    if(IsLogIn == true) {
        $.ajax({
            type: "get",
            url:'https://api.github.com/user?access_token='+window.localStorage.access_token,
            success: function (data) {
                window.localStorage.setItem('user_avatar_url',data.avatar_url);
                window.localStorage.setItem('user_url', data.html_url);
                commentInputInit();
            },
            error:function(data) {
                console.log("用户信息过期，退出登录状态");
                logout();
            }
        });
    } else {
        commentInputInit();
    }
}

function issueListPage() {
    var label = getUrlParam('label');
    var issue_url;
    var issue_perpage_url;
    if(label == undefined) {
        var search = getUrlParam('q');
        if(search == undefined)
        {
            issue_url = 'https://api.github.com/repos/'+config.name+'/'+config.repo;
            issue_perpage_url = 'https://api.github.com/repos/'+config.name+'/'+config.repo+'/issues?';
            getPageNum(issue_url);
        }else {
            issue_perpage_url = 'https://api.github.com/search/issues?q='+search+' author:'+config.name+'+in:title,body&';
            search = encodeURI(search);
            $.ajax({
                type: 'get',
                url: 'https://api.github.com/search/issues?q='+search+' author:'+config.name+'+in:title,body',
                success:function(data) {
                    pages = Math.ceil(data.total_count/10);
                    turnToPage(page, pages);
                }
            });
        }
    }else {
        issue_url = 'https://api.github.com/repos/'+config.name+'/'+config.repo+'/issues?labels='+label;
        issue_perpage_url = 'https://api.github.com/repos/'+config.name+'/'+config.repo+'/issues?labels='+label+'&';
        document.getElementById('title').innerHTML = label;
        $.ajax({
            type:'get',
            headers : {
                Accept: 'application/vnd.github.symmetra-preview+json',
            },
            url:'https://api.github.com/repos/'+config.name+'/'+config.repo+'/labels/'+label,
            success:function(data) {
                document.getElementById('instruction').innerHTML = data.description;
            }
        });
        getLabelPageNum(issue_url);
    }
    
    getIssuePerpage(issue_perpage_url);
}

function commentListInit(num, issue_id) {
    document.getElementById('comments-num').innerHTML = num;
    var comment_list = document.getElementById('comment-list');
    $.ajax({
        type : 'get',
        headers : {
            Accept: 'application/vnd.github.squirrel-girl-preview, application/vnd.github.html+json, application/x-www-form-urlencoded',
        },
        url:'https://api.github.com/repos/'+config.name+'/'+config.repo+'/issues/'+issue_id+'/comments?page='+page+'&per_page=10',
        success : function(data) {
            for(var i=0;i<data.length;i++) {
                data[i].created_at = utc2localTime(data[i].created_at);
                comment_list.innerHTML += '<li class="gitment-comment">'+
            '<a class="gitment-comment-avatar" href='+data[i].user.html_url+' target="_blank">'+
              '<img class="gitment-comment-avatar-img" src='+data[i].user.avatar_url+'></a>'+
            '<div class="gitment-comment-main"><div class="gitment-comment-header">'+
                '<a class="gitment-comment-name" href='+data[i].user.html_url+' target="_blank">'+data[i].user.login+'</a> 评论于 '+
                '<span>'+data[i].created_at+'</span></div><div class="gitment-comment-body gitment-markdown">'+
                data[i].body_html+'</div></div>';
            }
            
        }
    });
}

function commentInputInit() {
    var avatar = document.getElementById('avatar');
    if(IsLogIn == false) {
        avatar.innerHTML = '<a class="gitment-editor-avatar" href="javascript:login()" title="login with GitHub">'+
        '<svg class="gitment-github-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M25 10c-8.3 0-15 6.7-15 15 0 6.6 4.3 12.2 10.3 14.2.8.1 1-.3 1-.7v-2.6c-4.2.9-5.1-2-5.1-2-.7-1.7-1.7-2.2-1.7-2.2-1.4-.9.1-.9.1-.9 1.5.1 2.3 1.5 2.3 1.5 1.3 2.3 3.5 1.6 4.4 1.2.1-1 .5-1.6 1-2-3.3-.4-6.8-1.7-6.8-7.4 0-1.6.6-3 1.5-4-.2-.4-.7-1.9.1-4 0 0 1.3-.4 4.1 1.5 1.2-.3 2.5-.5 3.8-.5 1.3 0 2.6.2 3.8.5 2.9-1.9 4.1-1.5 4.1-1.5.8 2.1.3 3.6.1 4 1 1 1.5 2.4 1.5 4 0 5.8-3.5 7-6.8 7.4.5.5 1 1.4 1 2.8v4.1c0 .4.3.9 1 .7 6-2 10.2-7.6 10.2-14.2C40 16.7 33.3 10 25 10z"></path></svg>'+
      '</a></div>';
    }else {
        avatar.innerHTML = '<a class="gitment-comment-avatar" href='+window.localStorage.user_url+' target="_blank">'+
        '<img class="gitment-comment-avatar-img" src='+window.localStorage.user_avatar_url+'></a>';
    }

    var login = document.getElementById('login');
    if(IsLogIn == false) {
        login.innerHTML = '<a class="gitment-editor-login-link" href="javascript:login()">登入</a> with GitHub';
    }else {
        login.innerHTML = '<a class="gitment-editor-login-link" href="javascript:logout()">登出</a>';
    }

    var editor_content = document.getElementById('write-field');
    if(IsLogIn == false) {
        editor_content.innerHTML = '<textarea placeholder="(发表评论)" title="请登入以发表评论" disabled id="comment-input"></textarea>';
        $('.gitment-editor-submit').attr("disabled",true);
    }else {
        editor_content.innerHTML = '<textarea placeholder="(发表评论)" id="comment-input"></textarea>';
        $('.gitment-editor-submit').attr("disabled",false);
    }
}

function checkIsLogin() {
    if(window.localStorage.access_token != undefined) {
        IsLogIn = true;
    }
}

function editComment() {
    $('#editComment').addClass('gitment-selected');
    $('#preview').removeClass('gitment-selected');
    $('.gitment-editor-write-field').removeClass('gitment-hidden');
    $('.gitment-editor-preview-field').addClass('gitment-hidden');
}

function preview() {
    $('#editComment').removeClass('gitment-selected');
    $('#preview').addClass('gitment-selected');
    $('.gitment-editor-write-field').addClass('gitment-hidden');
    $('.gitment-editor-preview-field').removeClass('gitment-hidden');
    var preview_content = document.getElementById('preview-content');
    var comment_input = document.getElementById('comment-input').value;
    if(comment_input == "") {
        preview_content.innerHTML = '（没有预览）';
    }else {
        preview_content.innerHTML  = '预览加载中';
        $.ajax({
            type: "post",
            url:'https://api.github.com/markdown',
            headers: {
                Accept: 'text/html, application/vnd.github.squirrel-girl-preview, application/vnd.github.html+json, application/x-www-form-urlencoded',
                'Content-Type': 'text/html'
            },
            data : JSON.stringify({
                mode:'gfm',
                text:comment_input
            }),
            dataType: "text/html",
            success: function (message) {
                preview_content.innerHTML = message.responseText;
            },
            error: function(message) {
                preview_content.innerHTML = message.responseText;
            }
        });
    }
}

function login() {
    var url = 'https://github.com/login/oauth/authorize?client_id='+config.client_id+'&scope=public_repo&state='+window.location.href;
    window.location.href = url;
}

function logout() {
    IsLogIn = false;
    window.localStorage.clear();
    commentInputInit();
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; //返回参数值
}

function comment() {
    var input = document.getElementById('comment-input').value;
    var access_token = window.localStorage.access_token;
    $.ajax({
        type: "post",
        url:'https://api.github.com/repos/'+config.name+'/'+config.repo+'/issues/'+getUrlParam('id')+'/comments',
        headers: {
        Authorization : 'token '+ access_token,
            Accept: 'application/vnd.github.squirrel-girl-preview, application/vnd.github.html+json',
            'Content-Type': 'application/json'
        },
        data : JSON.stringify({
            "body" : input
        }),
        dataType: "json",
        success: function (data) {
            if(data.id != undefined) {
                document.getElementById('comment-input').value = "";
                data.created_at = utc2localTime(data.created_at);
                document.getElementById('comment-list').innerHTML += '<li class="gitment-comment">'+
            '<a class="gitment-comment-avatar" href='+data.user.html_url+' target="_blank">'+
              '<img class="gitment-comment-avatar-img" src='+data.user.avatar_url+'></a>'+
            '<div class="gitment-comment-main"><div class="gitment-comment-header">'+
                '<a class="gitment-comment-name" href='+data.user.html_url+' target="_blank">'+data.user.login+'</a> 评论于 '+
                '<span>'+data.created_at+'</span></div><div class="gitment-comment-body gitment-markdown">'+
                data.body_html+'</div></div>';
                document.getElementById('comments-num').innerHTML ++;
            }
        }
    });
}

function GetMenu() {
    $.ajax({
        type:'get',
        url:'https://api.github.com/repos/'+config.name+'/'+config.repo+'/labels',
        success:function(data) {
            document.getElementById('menu').innerHTML += '<li><a href="./"><span>首页</span></a></li>'
            for(var i=0;i<data.length;i++) {
                document.getElementById('menu').innerHTML += '<li><a href="issue_per_label.html?label='+data[i].name+'"><span>'+data[i].name+'</span></a></li>';
            }
            document.getElementById('menu').innerHTML += '<li><a href="content.html?id=41"><span>'+'关于我'+'</span></a></li>';
        },
    });
    document.getElementById("footer").innerHTML += 'Powered by <a href="https://github.com/imuncle/gitblog" target="_blank" style="color: aquamarine;text-decoration:none;border-bottom: 1px solid #79f8d4;">gitblog</a>';
}

// 获取每一页的issue内容
function getIssuePerpage(request_url) {
    console.log(request_url);

    //replaceAll替换函数
    String.prototype.replaceAll = function(a,b){
        return this.replace(new RegExp(a,'gm'),b);
    }
    $.ajax({
        type:'get',
        url:request_url+'page='+page+'&per_page=10',
        success:function(data) {
            var search = getUrlParam('q');
            if(search == undefined)
            {
                if(data.length == 0) {
                    document.getElementById('issue-list').innerHTML = '这个人很勤快但这里什么都还没写~';
                    $('.footer').css('position','absolute');
                }else {
                    document.getElementById('issue-list').innerHTML = '';
                    for(var i=0;i<data.length;i++) {
                        var labels_content = '';
                        for(var j=0;j<data[i].labels.length;j++) {
                            labels_content += '<li><a href=issue_per_label.html?label='+data[i].labels[j].name+'>'+data[i].labels[j].name+'</a></li>';
                        }
                        data[i].body = data[i].body.replace(/<(?!img).*?>/g, "");
                        data[i].created_at = utc2localTime(data[i].created_at);
                        document.getElementById('issue-list').innerHTML += '<li><p class="date">'+data[i].created_at+
                        '</p><h4 class="title"><a href="content.html?id='+data[i].number+'">'+data[i].title+
                        '</a></h4><div class="excerpt"><p class="issue">'+data[i].body+'</p></div>'+
                        '<ul class="meta"><li>'+data[i].user.login+'</li>'+labels_content+'</ul></li>';
                    }
                }
            }else {
                if(data.items.length == 0) {
                    window.location.href = "404.html"
                }else {
                    document.getElementById('issue-list').innerHTML = '';
                    for(var i=0;i<data.items.length;i++) {
                        var labels_content = '';
                        for(var j=0;j<data.items[i].labels.length;j++) {
                            labels_content += '<li><a href=issue_per_label.html?label='+data.items[i].labels[j].name+'>'+data.items[i].labels[j].name+'</a></li>';
                        }
                        data.items[i].body = data.items[i].body.replace(/<(?!img).*?>/g, "");
                        data.items[i].created_at = utc2localTime(data.items[i].created_at);
                        document.getElementById('issue-list').innerHTML += '<li><p class="date">'+data.items[i].created_at+
                        '</p><h4 class="title"><a href="content.html?id='+data.items[i].number+'">'+data.items[i].title+
                        '</a></h4><div class="excerpt"><p class="issue">'+data.items[i].body+'</p></div>'+
                        '<ul class="meta"><li>'+data.items[i].user.login+'</li>'+labels_content+'</ul></li>';
                    }
                    var html = document.getElementById('issue-list').innerHTML;
                    var newHtml = html.replaceAll(search,'<font style="background-color:yellow;">'+search+'</font>');
                    document.getElementById('issue-list').innerHTML = newHtml;
                }
            }
        }
    });
}

function utc2localTime(time) {
    var time_string_utc_epoch = Date.parse(time);
    var unixTimestamp = new Date(time_string_utc_epoch);
    return unixTimestamp.toLocaleString();
}

function getLabelPageNum(request_url) {
    // 获取issue数量，确定分页数目
    $.ajax({
        type:'get',
        url:request_url,
        success:function(data) {
            issue_num = data.length;
            var pages = 1;
            if(issue_num > 10) {
                pages = Math.ceil(issue_num/10);
                $('#pages').css('display','inline-block');
                document.getElementById('pages').innerHTML = '<li id="last_page"><a href="javascript:lastPage()">«</a></li>';
                for(var i=1;i<=pages;i++) {
                    if(getUrlParam('label')!=undefined) {
                        document.getElementById('pages').innerHTML += '<li><a id="page'+i+'" href="?label='+getUrlParam('label')+'&page='+i+'">'+i+'</a></li>'
                    }else if(getUrlParam('id')!=undefined) {
                        document.getElementById('pages').innerHTML += '<li><a id="page'+i+'" href="?id='+getUrlParam('id')+'&page='+i+'">'+i+'</a></li>'
                    }else {
                        document.getElementById('pages').innerHTML += '<li><a id="page'+i+'" href="?page='+i+'">'+i+'</a></li>';
                    }
                }
                document.getElementById('pages').innerHTML += '<li id="next_page"><a href="javascript:nextPage()">»</a></li>';
                turnToPage(page, pages);
                
            }
        }
    });
}

function getPageNum(request_url) {
    $.ajax({
        type:'get',
        url:request_url,
        success:function(data) {
            issue_num = data.open_issues_count;
            var pages = 1;
            if(issue_num > 10) {
                pages = Math.ceil(issue_num/10);
                $('#pages').css('display','inline-block');
                document.getElementById('pages').innerHTML = '<li id="last_page"><a href="javascript:lastPage()">«</a></li>';
                for(var i=1;i<=pages;i++) {
                    if(getUrlParam('label')!=undefined) {
                        document.getElementById('pages').innerHTML += '<li><a id="page'+i+'" href="?label='+getUrlParam('label')+'&page='+i+'">'+i+'</a></li>'
                    }else if(getUrlParam('id')!=undefined) {
                        document.getElementById('pages').innerHTML += '<li><a id="page'+i+'" href="?id='+getUrlParam('id')+'&page='+i+'">'+i+'</a></li>'
                    }else {
                        document.getElementById('pages').innerHTML += '<li><a id="page'+i+'" href="?page='+i+'">'+i+'</a></li>';
                    }
                }
                document.getElementById('pages').innerHTML += '<li id="next_page"><a href="javascript:nextPage()">»</a></li>';
                turnToPage(page, pages); 
            }
        }
    });
}

function turnToPage(page, pages) {
    if(page == 1) {
        $('#last_page').css('pointer-events','none');
        $('#next_page').css('pointer-events','auto');
    } else if(page == pages) {
        $('#next_page').css('pointer-events','none');
        $('#last_page').css('pointer-events','auto');
    }
    for(var i=1; i<=pages; i++) {
        if(i == page) {
            $('#page'+i).addClass('active');
        }else {
            $('#page'+i).removeClass('active');
        }
    }
}

function lastPage() {
    page--;
    if(getUrlParam('label')!=undefined) {
        window.location.href = '?label='+getUrlParam('label')+'&page='+page;
    }else if(getUrlParam('id')!=undefined) {
        window.location.href = '?id='+getUrlParam('id')+'&page='+page;
    }else {
        window.location.href = '?page='+page;
    }
}

function nextPage() {
    page++;
    if(getUrlParam('label')!=undefined) {
        window.location.href = '?label='+getUrlParam('label')+'&page='+page;
    }else if(getUrlParam('id')!=undefined) {
        window.location.href = '?id='+getUrlParam('id')+'&page='+page;
    }else {
        window.location.href = '?page='+page;
    }
}

window.onscroll = function() {
    if($(document).scrollTop() >= 0.6*document.documentElement.clientHeight) {
        $('.Totop').css('opacity',1);
    }else {
        $('.Totop').css('opacity',0);
    }
}
$(function () {
    getUserInfo();

    let { layer } = layui;

    // 退出功能
    $('#btnLogout').on('click', function () {
        //弹出提示信息
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
            //清除登录信息
            localStorage.removeItem('token');
            // 返回首页
            location.href = 'login.html';
            // layer.close(index);
          });
    })
});

function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success:function (res) {
          if (res.status !==0) {
              return layui.layer.msg('获取用户信息失败！');
            }
            renderAvatar(res.data);
        },
        //不管请求成功与否都会执行
        // complete:function (res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1&&res.responseJSON.message === '身份认证失败！') {
        //         //清除登录信息
        //         localStorage.removeItem('token');
        //         //返回登录页面
        //         location.href='login.html';
        //     }
        // }
    });
}

function renderAvatar(user) {
    const name = user.nickname || user.username;
    //渲染用户名
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`);
    // 渲染头像
    if (user.user_pic) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else { 
        const first = name[0].toUpperCase();//获取昵称首字母
        $('.text-avatar').html(first).show();
        $('.layui-nav-img').hide();
    }
}


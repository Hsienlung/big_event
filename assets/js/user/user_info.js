$(function () {
    //解构
    let { form,layer } = layui;
    //创建规则
    form.verify({
        nickname:function (value) {
            if (value.length>6) {
                return '昵称必须小于6位';
            }
        }
    });
    initUserinfo();
    //初始化用户的基本信息
    function initUserinfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success:function (res) {
                if (res.status !==0) {
                    return layer.msg('获取用户信息失败！');
                }
                //把数据渲染到页面上
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 重置按钮功能
    $('#btnReset').on('click', function (e) {
        //取消默认行为
        e.preventDefault();
        initUserinfo();
    });

    //监听表单的提交事件
    $('.layui-form').on('submit',function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success:function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功');
                initUserinfo();

                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
            }
        });
    })
})
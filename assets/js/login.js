$(function () {
    $('#link_login').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link_reg').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    });

    //自定义校验规则
    //1.从layui获取form对象
    // let form = layui.form;
    // 解构方式获取对象
    const { form, layer } = layui;
    form.verify({
        //自定义密码的校验规则
        pwd: [/^[\S]{6,12}$/, '密码不符合规则，必须为6-12位的非空字符'],
        //自定义确认密码规则
        repwd:function (value) {  //形参value为确认密码框的值
            // 获取输入的密码
            let pwd = $('.reg-box [name=password]').val().trim();
            // 判断两次密码是否一致
            if (value !== pwd) return '两次密码不一致，请再次确认密码';
        }
    });

    // 新用户注册
    $('#form_reg').on('submit', function (e) {
        //阻止表单默认行为
        e.preventDefault();
        //发起post请求
        $.post('/api/reguser',
            {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val(),
            },
            function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '注册失败');
                    return;
                }
                layer.msg(res.message || '注册成功');
                $('#link_reg').click();
            }
        );
    });

    //登录事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        //发起请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //获取表单提交信息
            data: $(this).serialize(),
            success:function (res) {
               if (res.status!==0) {
                   return layer.msg(res.message);   //登陆失败
                }
                //登陆成功
                layer.msg(res.message);
                // 保存身份验证信息
                localStorage.setItem('token', res.token);
                //跳转页面
                location.href = '/index.html';
            }
        });
    })
})
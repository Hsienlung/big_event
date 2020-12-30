$(function () {

    const { form, layer } = layui;
    // 新增自定义密码规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须是6到12位，且不能出现空格'],
        samePwd:function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同';
            }
        },
        rePwd:function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致';
            }
        }
    });

    $('.layui-form').on('submit',function (e) {
        e.preventDefault();
        // console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data:$(this).serialize(),
            success:function (res) {
                if (res.status !== 0) {
                   return layer.msg('密码更新失败！');
                }
                layer.msg('更新密码成功');
                //重置表单  DOM方法需要转成DOM元素
                $('.layui-form')[0].reset();
            }
        });
    })
})
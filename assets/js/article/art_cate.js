$(function () {
    const { form, layer } = layui;
    initArtCateList();

    //获取文章分类的列表 渲染数据
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }

    //新增文章类别
    let indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });

    //通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章类别失败');
                }
                //重新加载文章类别
                initArtCateList();
                layer.msg('新增文章类别成功');
                layer.close(indexAdd);
            }
        });
    });

    //通过代理的形式，为编辑按钮添加点击事件
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-edit').html()
        });
        // 获取由自定义属性添加的id
        let id = $(this).data('id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data);//渲染到页面上
            }
        });
    });

    //修改成功之后更新页面
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }
                layer.msg('更新分类数据成功！');
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    });

    //用代理的形式，为删除按钮绑定点击事件
    $('body').on('click','.btn-delete',function () {
        let id = $(this).data('id');
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success:function (res) {
                    if (res.status!==0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            });
          });
    })
})
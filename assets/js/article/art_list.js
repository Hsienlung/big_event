$(function () {
    const { layer,form,laypage } = layui;
    //定义一个查询的参数对象，请求文章数据的时候提交到服务器
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    //定义模板引擎过滤器函数
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
      
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    initTable();
    initCate();
    //获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //用模板引擎渲染到页面
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                //调用渲染文章分页方法
                renderPage(res.total);
            }
        });
    }
    //获取文章分类数据
    function initCate() {
        $.ajax({
            method: 'GET',
            url:'/my/article/cates',
            success:function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败');
                }
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        });
    }

    // 为文章类别表单添加筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    });

    //定义渲染分页的方法，接收一个总数量
    function renderPage(total) {
        //layui框架渲染分页结构
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//配置分页排版项
            limits:[2,3,5,10],//配置分页展示条数
            //分页被触发时的回调函数
            //触发jump回调函数的方式有两种
            //1.点击页码的时候
            //2.laypage.render()  被调用的时候
            jump:function (obj,first) {   
                q.pagenum = obj.curr;//把当前分页赋值给参数对象
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit;
                // 再次调用函数
                //通过第二个参数可以判断jump被触发的方式
                //点击触发  first === undefined
                //laypage.render()被调用时触发  first  === true
                if(!first){
                    initTable();//点击触发的时候刷新页面
                  }
            }
          });
    }

    //为删除按钮绑定点击事件
    $('body').on('click', '.btn-delete', function () {
        //获取当前页面数据条数
        let len = $('.btn-delete').length;
        // 获取到文章的 id
        let id = $(this).attr('data-id');
        // let aa = $(this).data('id');
        // console.log(aa);

        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    //数据删除完成后，判断当前页面是否还有剩余数据，没有的话让页码值-1
                    //如果len===1说明，页面上只有要删除的这条数据，删除完成之后就没有了
                    if (len === 1&& q.pagenum !== 1) q.pagenum -= 1;//页码值最小是1
                    initTable();
                }
            });
            layer.close(index);
        });
    });
})
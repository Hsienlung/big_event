
//在执行ajax请求之前会执行这个方法
$.ajaxPrefilter(function (options) {
    options.url = "http://ajax.frontend.itheima.net" + options.url;
    

    // 统一为有权限的接口，设置hearders
    if (options.url.indexOf('/my/')!==-1) {
        options.headers = {
            Authorization: localStorage.getItem('token')
        };
    }

    options.complete = function (res) {
        console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //清除登录信息
            localStorage.removeItem('token');
            //返回登录页面
            location.href = 'login.html';
        }
    };
  });
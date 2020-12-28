
//在执行ajax请求之前会执行这个方法
$.ajaxPrefilter(function (options) {
    console.log(1111);
      options.url = "http://ajax.frontend.itheima.net" + options.url;
  });
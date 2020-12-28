$(function () {
    getUserInfo();
});

function getUserInfo() {
    $.ajax({
        url: 'http://ajax.frontend.itheima.net/my/userinfo',
        method: 'GET',
        headers: {
            Authorization: localStorage.getItem('token')
        },
        success:function (res) {
            console.log(res);
        }
    });
}
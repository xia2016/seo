String.prototype.trim = function()
{
    return this.replace(/^\s*|\s*$/g,"");
};
Array.prototype.indexOf = function(b) {
    var a = this.length >>> 0;
    var c = Number(arguments[1]) || 0;
    c = (c < 0) ? Math.ceil(c) : Math.floor(c);
    if (c < 0) {
        c += a
    }
    for (; c < a; c++) {
        if (c in this && this[c] === b) {
            return c
        }
    }
    return -1
};
Array.prototype.remove = function(n)
{
    if (n < 0)
    {
        return this;
    }
    else
    {
        return this.slice(0, n).concat(this.slice(n + 1, this.length));
    }
};
var DAMY = new Object();
DAMY.loader = {
    submit_btn:'',
    submit_btn_txt : '',
    csname :'',
    form:'',
    submit:function(form){
        //提交表单
        this.form = $(form);
        this.submit_btn = this.form.find('[type=submit]');
        this.csname = this.submit_btn[0].tagName;
        this.setSubmitText('加载中...');
    },
    setSubmitText:function(txt){
        //提交按钮还原
        if(DAMY.loader.csname == 'INPUT'){
            this.submit_btn_txt = this.submit_btn.val();
            this.submit_btn.val(txt);
        }
        else{
            this.submit_btn.attr('disabled','true')
            this.submit_btn_txt = this.submit_btn.html();
            this.submit_btn.html(txt);
        }
    },
    resetForm:function(){
        //还原表单
        this.setSubmitText(this.submit_btn_txt);
        this.submit_btn.removeAttr('disabled');
        // 刷新验证码，如果有的话 
        //if($('.validcode').length){
        //    $('.validcode').val('');
        //    $('.validcode').parent().find('img').click();
        //}
    },
    fielderror:function(id,msg){
        //表单提示显示
        var obj = $('#form_group_' + id);
        if(!obj.hasClass('has-error')){
            obj.addClass('has-error');
        }
        obj = $('#' + id);
        obj.tooltip({placement:'right', 'title':msg, trigger:'manual'}).tooltip('show');
        obj.focus(function(){
            $('#form_group_' + id).removeClass('has-error');
            obj.tooltip('destroy');
        });
        if(obj.hasClass('validcode')){
            obj.val('');
            obj.parent().find('img').click();
        }
    },
    validate:function(obj){
        //返单提示信息
        for(var item in obj){
            this.fielderror(item,obj[item]);
        }
        this.resetForm();
    },
    success:function(obj){
        //返单提交成功后返回信息
        //显示提示信息
        if (typeof ret_succ_callback != 'undefined'){
            return ret_succ_callback(obj);
        }
        if(obj.url){
            location.href = obj.url;
        }else{

            var s_obj = $(this.form).find('[name=submit_info]');
            s_obj.html('<i></i>'+obj.message);
            s_obj.addClass('success');
            s_obj.fadeIn();
            this.resetForm();
            setTimeout(function(){
                s_obj.fadeOut();
            },3000);
        }
    },
    error:function(obj){
        var s_obj = $(this.form).find('#form-err-msg');

        s_obj.html(obj.message);
        // s_obj.addClass('err');

        s_obj.fadeIn();
        this.resetForm();
        setTimeout(function(){
            s_obj.fadeOut();
        },3000);
    },
    sendSMS:function(url,uid,obj,act,vd){
    //短信发送
        function sec_send(){
            var em = $(obj).find('em');
            var sec = 0;
            if(em.length) sec = parseInt(em.html());
            if(sec == 0){
                $(obj).html('重新获取');
            }else{
                sec = sec - 1;
                em.html(sec);
                window.setTimeout(sec_send,1000);
            }
        }
        var em = $(obj).find('em');
        var sec = 0;
        if(em.length) sec = parseInt(em.html());
        if(sec > 0){
            return;
        }
        var id = "";
        if(uid && $('#' + uid).length){
            id = $('#' + uid).val();
            if(!id || !(/^1(3|4|5|7|8)\d{9}$/.test(id))){
                this.fielderror(uid,'请输入正确的手机号码');
                return;
            }
        }
        var me = this;
        $(obj).html('发送中...');
        $.post(url,{id:id}, function (msg) {

            // if(msg.ret == -1){
            //     me.fielderror(uid,'请输入正确的手机号码');
            //     $(obj).html('重新发送');
            //     return;
            // }
            // if(msg.ret == -2){
            //     me.fielderror(vd,'请输入正确的图形验证码');
            //     $(obj).html('重新发送');
            //     return;
            // }
            // if(msg.ret == -3){
            //     me.fielderror(vd,'图形验证码已经过期');
            //     $(obj).html('重新发送');
            //     return;
            // }
            // if(msg.ret == -4){
            //     me.fielderror(uid,'该用户不存在');
            //     $(obj).html('重新发送');
            //     return;
            // }
            // if(msg.ret == -5){
            //     me.fielderror(uid,'此用户已经注册');
            //     $(obj).html('重新发送');
            //     return;
            // }
            // $(obj).html('<em style="font-style:normal">59</em>秒后重新获取');
            // if(msg.ret == 1){
            //     window.setTimeout(sec_send,1000);
            //     return;
            // }
            // else if(msg.ret == 0){
            //     me.fielderror(uid,'发送验证码太频繁');
            //     window.setTimeout(sec_send,1000);
            // }else{
            //     var msg_alert = '发送验证码失败：' + msg.ret;
            //     if(msg.ret == '3'){
            //         msg_alert = '手机号码错误，请核实后再发'
            //     }
            //     me.fielderror(uid, msg_alert);
            //     $(obj).html('重新发送');
            // }
        });
    }

}


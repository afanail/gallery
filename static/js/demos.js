$(document).ready(function () {

    window.prettyPrint && prettyPrint()     // 初始化

    /**
     * 接口地址
     */
    var getFile = 'http://172.28.130.73:8082/ws-service/ImageHandler/getFiles'
    var uploadImg = 'http://172.28.130.73:8082/ws-service/ImageHandler/uploadImg'
    var wsuri = "ws://172.28.130.73:8083/ws-service/websocketServer"      //服务器的地址
    var $thumb = $('#thumbnials-without-animation')

    /**
     * 初次进来获取所有图片
     */
    $.ajax({
        url:getFile,
        type: 'get',
        success: function(data){
            console.log(data.data.length)
            for (var i = data.data.length -1 ; i >= 0 ; i--) {
                var fragments = ` <a  class="" href="${data.data[i].url}">
                    <img class="img-responsive" src="${data.data[i].url}">
                    <div class="demo-gallery-poster">
                        <img src="../static/img/zoom.png">
                    </div></a>`
                $thumb.prepend(fragments)
            }
            if ($thumb.length) {
                $thumb.justifiedGallery({
                    border: 6
                }).on('jg.complete', function () {
                    $thumb.lightGallery({
                        thumbnail: true,
                        // animateThumb: false,
                        // showThumbByDefault: false
                    });
                });
            };
        },
        error: function(err){
            console.log('err',err)
        }
    })

    var sock = null
    sock = new WebSocket(wsuri)
    sock.onopen = function () {  //成功连接到服务器
        console.log("success connected to " + wsuri)
    }
    sock.onclose = function (e) {
        console.log("connection closed (" + e.code + ")")
    }
    sock.onmessage = function (e) {
        //服务器发送通知
        //开始处理
        console.log("message received: " + e.data)
        var data = JSON.parse(e.data)
        console.log(data)
        $thumb.empty()
        for (var i = data.data.length - 1; i >= 0 ; i--) {
            var fragments = ` <a  class="" href="${data.data[i].url}">
            <img class="img-responsive" src="${data.data[i].url}">
            <div class="demo-gallery-poster">
                <img src="../static/img/zoom.png">
            </div></a>`
            $thumb.append(fragments)
        }
        if ($thumb.length) {
            $thumb.justifiedGallery({
                border: 6
            }).on('jg.complete', function() {
                $thumb.lightGallery({
                    thumbnail: true,
                    // animateThumb: false,
                    // showThumbByDefault: false
                });
            });
        };
        

    }
    var file
    var uploading = false
    $("#ctn-input-file").on("change", function () {
        if (uploading) {
            alert("文件正在上传中，请稍候");
            return false;
        }
        //console.log($('#ctn-input-file').val())
        if (!$('#ctn-input-file').val().match(/.jpg|.gif|.png|.jpeg|.bmp/i)) {　　 //判断上传文件格式
            return alert("上传的图片格式不正确，请重新选择");
        }

        //获取文件
        file = $('#ctn-input-file')[0].files[0]
        // 显示选择的图片名称
        $('.fake-input-text').val(file.name)
        //创建读取文件的对象
        var reader = new FileReader()
        //为文件读取成功设置事件
        reader.onload=function(e) {
            imgFile = e.target.result
            $('.review-image').attr('src', imgFile)
        }
        //正式读取文件
        reader.readAsDataURL(file)
        $('#uploadnow').show()
    });

    // 点击上传图片
    $('#uploadnow').on('click',function(){
        $.ajax({
            url: uploadImg,
            type: 'POST',
            cache: false,
            data: new FormData($('#infoLogoForm')[0]),
            processData: false,
            contentType: false,
            dataType: "json",
            beforeSend: function () {
                uploading = true;
            },
            success: function (data) {
                uploading = false;
                $('#uploadnow').hide()
            }
        });
    })


    // 预览选择的图片
    $('.review-image').click(function () {
        var e = e || window.event
        $('.mask').css('display', 'block')
        $('.mask-image').attr('src', imgFile)
    })

    // 关闭遮罩层
    $('.mask').click(function () {
      $('.mask').css('display', 'none')
    })


    $('#fixed-size').lightGallery({
        width: '700px',
        height: '470px',
        mode: 'lg-fade',
        addClass: 'fixed-size',
        counter: false,
        download: false,
        startClass: '',
        enableSwipe: false,
        enableDrag: false,
        speed: 500
    });

    $('#html5-videos').lightGallery({
        thumbnail: false
    });

    $('#html5-videos-videojs').lightGallery({
        videojs: true
    });

    $('#videos').lightGallery();
    $('#videos-without-poster').lightGallery();
    $('#video-player-param').lightGallery({
        youtubePlayerParams: {
            modestbranding: 1,
            showinfo: 0,
            rel: 0,
            controls: 0
        },
        vimeoPlayerParams: {
            byline: 0,
            portrait: 0,
            color: 'A90707'
        }
    });

    $('#video-thumbnails').lightGallery({
        loadYoutubeThumbnail: true,
        youtubeThumbSize: 'default',
        loadVimeoThumbnail: true,
        vimeoThumbSize: 'thumbnail_medium'
    });

    $('#dynamic').on('click', function () {
        $(this).lightGallery({
            dynamic: true,
            dynamicEl: [{
                src: '../static/img/1.jpg',
                thumb: '../static/img/thumb-1.jpg',
                subHtml: '<h4>Fading Light</h4><p>Classic view from Rigwood Jetty on Coniston Water an old archive shot similar to an old post but a little later on.</p>'
            }, {
                src: '../static/img/2.jpg',
                thumb: '../static/img/thumb-2.jpg',
                subHtml: '<h4>Bowness Bay</h4><p>A beautiful Sunrise this morning taken En-route to Keswick not one as planned but I\'m extremely happy I was passing the right place at the right time....</p>'
            }, {
                src: '../static/img/13.jpg',
                thumb: '../static/img/thumb-13.jpg',
                subHtml: '<h4>Sunset Serenity</h4><p>A gorgeous Sunset tonight captured at Coniston Water....</p>'
            }, {
                src: '../static/img/3.jpg',
                thumb: '../static/img/thumb-3.jpg',
                subHtml: '<h4>Coniston Calmness</h4><p>Beautiful morning</p>'
            }]
        })
    });

    function customTransitions(trans) {
        $('#custom-transitions').lightGallery({
            mode: trans
        })
    }

    customTransitions('lg-slide');

    $('#select-trans').on('change', function () {
        $('#custom-transitions').data('lightGallery').destroy(true);
        customTransitions($(this).val());
    });

    function customEasing(ease) {
        $('#custom-easing').lightGallery({
            cssEasing: ease
        })
    }

    customEasing('cubic-bezier(0.680, -0.550, 0.265, 1.550)');

    $('#select-ease').on('change', function () {

        var val = $(this).val();
        prompt('You can copy cubic-bezier from here', val);

        $('#custom-easing').data('lightGallery').destroy(true);
        customEasing('cubic-bezier(' + val + ')');
    });

    // Custom events
    var $customEvents = $('#custom-events');
    $customEvents.lightGallery();

    var colours = ['rgb(33, 23, 26)', 'rgb(129, 87, 94)', 'rgb(156, 80, 67)', 'rgb(143, 101, 93)'];
    $customEvents.on('onBeforeSlide.lg', function (event, prevIndex, index) {
        $('.lg-outer').css('background-color', colours[index])
    });

    // Responsive images
    $('#responsive-images').lightGallery();
    $('#srcset-images').lightGallery();

    // methods
    var $methods = $('#methods');
    var slide = '<li class="col-xs-6 col-sm-4 col-md-3" data-src="../static/img/4.jpg">' +
        '<a href="">' +
        '<img class="img-responsive" src="../static/img/thumb-4.jpg">' +
        '<div class="demo-gallery-poster">' +
        '<img src="../static/img/zoom.png">' +
        '</div>' +
        '</a>' +
        '</li>';

    $methods.lightGallery();
    $('#appendSlide').on('click', function () {
        $methods.append(slide);
        $methods.data('lightGallery').destroy(true);
        $methods.lightGallery();
    });

    // iframe
    $('#open-website').lightGallery({
        selector: 'this'
    });

    // Google map
    $('#google-map').lightGallery({
        selector: 'this',
        iframeMaxWidth: '80%'
    });

    $('#captions').lightGallery();
    $('#relative-caption').lightGallery({
        subHtmlSelectorRelative: true
    });
    $('#hash').lightGallery();

    $('#lg-share-demo').lightGallery();

    var $commentBox = $('#comment-box');
    $commentBox.lightGallery({
        appendSubHtmlTo: '.lg-item',
        addClass: 'fb-comments',
        mode: 'lg-fade',
        download: false,
        enableDrag: false,
        enableSwipe: false
    });
    $commentBox.on('onAfterSlide.lg', function (event, prevIndex, index) {
        if (!$('.lg-outer .lg-item').eq(index).attr('data-fb')) {
            try {
                $('.lg-outer .lg-item').eq(index).attr('data-fb', 'loaded');
                FB.XFBML.parse();
            } catch (err) {
                $(window).on('fbAsyncInit', function () {
                    $('.lg-outer .lg-item').eq(index).attr('data-fb', 'loaded');
                    FB.XFBML.parse();
                });
            }
        }
    });

    var $commentBoxSep = $('#comment-box-sep');
    $commentBoxSep.lightGallery({
        addClass: 'fb-comments',
        download: false,
        galleryId: 2
    });
    $commentBoxSep.on('onAfterAppendSubHtml.lg', function () {
        try {
            FB.XFBML.parse();
        } catch (err) {
            $(window).on('fbAsyncInit', function () {
                FB.XFBML.parse();
            });
        }
    });


});

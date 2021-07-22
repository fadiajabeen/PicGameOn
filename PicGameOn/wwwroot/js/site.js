Japan = { x1: 0, x2: 0, y1: 0, y2: 0 };
China = { x1: 0, x2: 0, y1: 0, y2: 0 };
Korea = { x1: 0, x2: 0, y1: 0, y2: 0 };
Thai = { x1: 0, x2: 0, y1: 0, y2: 0 };

Images = [];
I_index = 0;

win_height = win_width = anime_height = 0;
in_next_anime_range = in_mouseup = false;
dx = dy = x = y = 0;
last_pageX = last_pageY = 0;
Time_Start = 0;
Elapsed_Time = 0;

$(window).on('load', function () {
    GetImageSet();
});


$(document).ready(function () {
    $("#face_pic_wrap").draggable();
    win_height = $(window).height();
    win_width = $(window).width();

    width_offset = 30;

    Japan = { x1: 0, x2: (win_width / 2) - width_offset, y1: 0, y2: win_height / 2};
    Korea = { x1: 0, x2: (win_width / 2) - width_offset , y1: win_height / 2, y2: win_height };
    China = { x1: (win_width / 2) + width_offset, x2: win_width, y1: 0, y2: win_height / 2 };
    Thai = { x1: (win_width / 2), x2: win_width, y1: win_height / 2, y2: win_height };

    anime_height = win_height - (10.5 * win_height / 100);

});

function SlideDown() {
    Elapsed_Time = 0;
    Time_Start = new Date().getTime();
    if ($('#face_pic').attr('src')) {
        $("#face_pic").finish().fadeOut(4500);
        $("#face_pic_wrap").animate({ top: '+=' + anime_height }, 3000, EndedInitialAnimation);
    }
}

$("#face_pic_wrap").mousedown(function (e) {

    x = e.clientX;
    y = e.clientY;

    $("#face_pic_wrap").data("dragging", true);
    face_pic_wrap = document.getElementById("face_pic_wrap");
    face_pic_wrap.addEventListener('mouseup', mouseup, false);
    face_pic_wrap.addEventListener("mousemove", mouseMove, false);
});

function mouseMove(e) {
    if (!$(this).data("dragging"))
        return;

    dx = e.clientX - x;
    dy = e.clientY - y;

    if (dx > 30 || dx < -30 ) {
        last_pageX = e.pageX;
        last_pageY = e.pageY;
        in_next_anime_range = true;
        elem = document.getElementById("face_pic_wrap");
        mouseup(e);
    }
    else
        in_next_anime_range = false;
}

function mouseup(e) 
{
    elem = document.getElementById("face_pic_wrap");
    elem.removeEventListener("mousemove", mouseMove);
    elem.removeEventListener("mouseup", mouseup);
    if (in_next_anime_range) {
        in_mouseup = true;
        console.log("inside mouse up inner start");
        $("#face_pic").finish().fadeIn(1);
        Elapsed_Time = new Date().getTime() - Time_Start;

        last_X_coord = last_pageX;
        last_Y_coord = last_pageY;

        top = ''; left = '';
        offset = 150;
        upper = false;
        if (Japan.x1 <= last_X_coord && last_X_coord <= Japan.x2 && Japan.y1 <= last_Y_coord && last_Y_coord <= Japan.y2) {
            top = -offset;                      //+ (last_pageY - width_offset )+ 'px';
            left = -offset;                     // + (last_pageX - width_offset ) + 'px';
            $('#selected_box').val('jap');
            $("#jap").css('background-color', '#faee48');
            last_pageX = last_pageX - 2 * 92;
            last_pageY = last_pageY - 92;
            upper = true;
        }
        else if (China.x1 <= last_X_coord && last_X_coord <= China.x2 && China.y1 <= last_Y_coord && last_Y_coord <= China.y2) {
            top = -offset;
            left = win_width- offset;
            $("#chi").css('background-color', '#faee48');
            $('#selected_box').val('chi');
            last_pageY = last_pageY - 92;
            upper = true;
        }
        else if (Korea.x1 <= last_X_coord && last_X_coord <= Korea.x2 && Korea.y1 <= last_Y_coord && last_Y_coord <= Korea.y2) {
            top = win_height - offset;
            left = -offset;
            $("#kor").css('background-color', '#faee48');
            $('#selected_box').val('kor');
            last_pageX = last_pageX - 92;
            last_pageY = last_pageY - 30;
        }
        else if (Thai.x1 <= last_X_coord && last_X_coord <= Thai.x2 && Thai.y1 <= last_Y_coord && last_Y_coord <= Thai.y2) {
            top = win_height - offset;             //'+=45%';
            left = win_width - offset;   //'+=45%';
            $("#tha").css('background-color', '#faee48');
            $('#selected_box').val('tha');
        }

        if (top && left) {
            $('#face_pic_wrap').stop(true);
            in_next_anime_range = false;
            $("#face_pic_wrap").data("dragging", false);
            $("#face_pic_wrap").finish().removeAttr('style');
            $("#face_pic_wrap").css("left", last_pageX + 'px');
            $("#face_pic_wrap").css("top", last_pageY + 'px');
            $("#face_pic").fadeOut(3500);
            if(upper)
                $("#face_pic_wrap").velocity({ top: top, left: left }, 3000, displayFacePicWrap);
            else
                $("#face_pic_wrap").velocity({ left: left, top: "100%"}, 3000, displayFacePicWrap);
           // $("#face_pic_wrap").animate({ left: left, top: top }, 3000, displayFacePicWrap);
        }
        else {

            in_mouseup = false;
            in_next_anime_range = false;
            $("#face_pic_wrap").data("dragging", false);

            if (Elapsed_Time / 1000 < 3) {
                remainingTime = 3 - (Elapsed_Time / 1000);

                if (dx > 0)
                    xoffset = $(this).offsetLeft - dx;
                else
                    xoffset = $(this).offsetLeft + dx;

                if (dy > 0)
                    yoffset = $(this).offsetTop - dy;
                else
                    yoffset = $(this).offseTop + dy;

                $("#face_pic_wrap").css("left", xoffset + 'px');
                $("#face_pic_wrap").css("top", yoffset + 'px');
                $("#face_pic").fadeOut(2000);
            }
        }
    }
}

function EndedInitialAnimation() {
    if ( (!$('#face_pic_wrap').data("dragging") || !in_next_anime_range) && !in_mouseup) {
        ExcludeImage();
        LoadNewImage();
    }
}

function displayFacePicWrap() {
    in_mouseup = false;
    imagePath = ($('#face_pic').attr("src"));
    imageName = imagePath.split('/')[imagePath.split('/').length - 1];
    nationalityName = $('#selected_box').val();
    MatchImageNationality(imageName, nationalityName);
    $("#" + nationalityName).css('background-color', '#FFFFFF');
    ClearAll();
    LoadNewImage();
}

function Replay() {
    ResetBoxesBackground();
    in_mouseup = in_next_anime_range = false;

    $("#replay").addClass("d-none");
    $('#face_pic_wrap').removeAttr('style');
    $('#face_pic').attr('src', '');
    $('#face_pic').fadeIn(0);
    GetImageSet();
}


function LoadNewImage() {
    ClearAll();
    $('#face_pic_wrap').finish().removeAttr('style');
    if (I_index < 10) {
        $('#face_pic').fadeIn(0);
        $("#face_hid").attr("src", Images[I_index]);
        $("#face_pic").attr("src", Images[I_index]);
        I_index += 1;
    }
    else {
        $('#face_pic').finish().fadeOut(1);
        $("#replay").removeClass("d-none");
        ResetBoxesBackground();
    }
}

function ResetBoxesBackground() {
    $("#jap").css('background-color', '#FFFFFF');
    $("#chi").css('background-color', '#FFFFFF');
    $("#kor").css('background-color', '#FFFFFF');
    $("#tha").css('background-color', '#FFFFFF');
}

function ClearAll() {
    $("#face_pic_wrap").data("dragging", false);
    in_next_anime_range = in_mouseup = false;
    dx = dy = x = y = 0;
    last_pageX = last_pageY = 0;
}

/* Ajax Calls */

function GetImageSet() {
    $('#score').html('0');
    $.ajax
        ({
            url: '?handler=ImageSet',
            dataType: "json",
            type: "GET",
            data: { prevSet: Images},
            cache: false,
            success: function (data) {
                if (data.count > 0) {
                    I_index = 1;
                    Images = data.images;

                    $("#face_pic_wrap p").addClass("d-none");
                    $("#face_pic").removeClass("d-none");
                    $("#face_pic").attr("src", Images[0]);
                }
                else {
                    $("#face_pic_wrap p").removeClass("d-none");
                    $("#face_pic").addClass("d-none");
                }
            },
            error: function (xhr) { $('#info p').html(xhr.error); }
        });
}

function MatchImageNationality(imageName, nationalityName) {
    score_current = Number($('#score').html().split('/')[0]);
    new_score = score_current;
    $.ajax
        ({
            url: '?handler=MatchNationality&imageName=' + imageName + '&nationalityName=' + nationalityName ,
            dataType: "json",
            type: "GET",
            cache: false,
            success: function (data) {
                if (data.matched) {
                    new_score = score_current + data.score;
                    $("#" + nationalityName).css('background-color', '#8cdb0d');
                }
                else {
                    new_score = score_current - data.score;
                    $("#" + nationalityName).css('background-color', '#db280d');
                }

                $('#score').html(new_score+'/'+ (I_index*20));
            },
            error: function (xhr) { alert(xhr.error); $('#score').html(score_current + '/' + (I_index * 20));}
        });
}

function ExcludeImage() {
    score_current = Number($('#score').html().split('/')[0]);
    $('#score').html(score_current + '/' + (I_index * 20));

    imagePath = ($('#face_pic').attr("src"));
    imageName = imagePath.split('/')[imagePath.split('/').length - 1];
    $.ajax
        ({
            url: '?handler=ExcludeImage&imageName=' + imageName,
            dataType: "json",
            type: "GET",
            cache: false,
            success: function (data) {
                if (data.success)
                    ;
            },
            error: function (xhr) {  }
        });
}

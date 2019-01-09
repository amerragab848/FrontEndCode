/*global $,  document,  window, setInterval */
/* eslint-disable no-console */

$(document).ready(function () {
    "use strict";
    /*********************  popUp Close icon *********************/
    $(".closePopUpBtn").on('click', function () {
        $(this).parent().fadeOut();
    });
    $('.popUpiMark')
        .popup();

    $(".inputXmark").hover(function () {
        $(".popUp").fadeToggle(200);
        $(".popUp").css("display", "table");
    });
    /*********************  End popUp Close icon *********************/

    /********************** Stepper Func *********************/
    $(".StepperNum .StepNumber").on('click', function () {
        $(this).addClass("active").nextAll().removeClass("active");
        $(this).addClass("active").prevAll().addClass("active");
        $(this).prevAll().children().children('.StepTrue').css("display", "block");
        $(this).prevAll().children().children('.StepN').css("display", "none");
        $(this).nextAll().children().children('.StepN').css("display", "block");
        $(this).nextAll().children().children('.StepTrue').css("display", "none");

        $(this).children().children('.StepTrue').css("display", "none");
        $(this).children().children('.StepN').css("display", "block");
        /*2*/
        $(this).addClass("activea").siblings().removeClass("activea");

    });
    $(".StepperNum4 .StepNumber").on('click', function () {
        /*4*/
        $(this).prevAll().children('.StepNum').css("background-color", "#5fd45f");
        $(this).nextAll().children('.StepNum').css("background-color", "#ccd2db");
    });
    $(".StepperNumV .StepNumber").on('click', function () {
        $(this).next().addClass("ActiveHei").siblings().removeClass("ActiveHei");
        $(this).addClass("ActiveHei").prev().addClass("ActiveHei");
    });
    /*Slider Stepper*/
    $(function () {
        var step = 0,
            stepItem = $('.StepperWorkFlow .step-progress .step-slider .step-slider-item');
        // Step Next
        $('.StepperWorkFlow .step-content-foot .step-content-btn').on('click', function () {
            var instance = $(this);
            $('.StepperWorkFlow .step-content-foot .step-content-btn-prev').removeClass('disabled');
            if (step === (stepItem.length - 2)) {
                instance.addClass('disabled');
            }
            $(stepItem[step + 1]).addClass('active');
            $('.StepperWorkFlow .step-content-body').addClass('out');
            $('#' + stepItem[step + 1].dataset.id).removeClass('out');
            step += 1;
        });
        // Step Previous
        $('.StepperWorkFlow .step-content-foot .step-content-btn-prev').on('click', function () {
            var instance = $(this);
            if (step === (stepItem.length - 2)) {
                $('.StepperWorkFlow .step-content-foot .step-content-btn').removeClass('disabled');
                instance.siblings('.StepperWorkFlow .step-content-btn').removeClass('out');
            }
            if (step <= 1) {
                instance.addClass('disabled');
            }
            $(stepItem[step]).removeClass('active');
            $('.StepperWorkFlow .step-content-body').addClass('out');
            $('#' + stepItem[step - 1].dataset.id).removeClass('out');
            step -= 1;
        });

    });
    /*End Slider*/

    /********************** End Stepper Func *********************/

    /**********************NiceScroll********************** */
    /*
        $("body").niceScroll({
            cursorwidth: "10px",
            cursorcolor: "#cdcdd7",
            cursorminheight: -0
        });*/

    /*
        $(".MainProjectsMenuUL").niceScroll({
            cursorwidth: "7px",
            cursorcolor: "#cdcdd7"
        });
    */


    $(".ui.selection.dropdown .menu").niceScroll({
        cursorwidth: "6px",
        cursorcolor: "#a8b0bf"
    });

    $(".girdTableHeader, .gridSystemTables").niceScroll({
        cursorminheight: -0,
        cursorwidth: "-2px",
        autohidemode: false,
        cursorcolor: "rgba(0, 0, 0)"
    });


    /**/


    /******************** End	NiceScroll ***********************/


    /***************   DropDOwn Activate   ***************/
    $('.ui.dropdown').dropdown();

    /*    $('.ui.dropdown.selection').dropdown();
        $('.ui.dropdown.sss')
            .dropdown({
                on: 'hover'
            });*/
    /***************  End DropDOwn Activate   ***************/


    /**********************   Start Accordion   **********************/
    $('.ui.accordion').accordion();
    /********************** End  Start Accordion   **********************/


    /****************      modal     ****************/
    /*$('.ui.modal').modal({
        allowMultiple: false
    });*/

    $('.modalBtn').on('click', function () {
        var modal = $(this).attr('data-modal');
        $('#' + modal + '.modal').modal({
            autofocus: false
        }).modal('show');
    });
    /****************  End  modal     ****************/

    /*****************  Main Navigation Function *****************/

    $(".mainSide").hover(function () {
        $(".mainSidenavContent, .header-logocontent").addClass("hover");
    }, function () {
        $(".mainSidenavContent, .header-logocontent").removeClass("hover");
        $(".mainProjectName").removeClass("activeClass");
        $(".ProjectsUlList").removeClass("active");
        $(".ProjectsUlList").addClass("hidden");

        $(".MainProjectsMenu").removeClass("active");
        $(".modulesMenuIcons").addClass("active");
        $(".modulesMenuIcons").removeClass("hidden");
    });

    /*Projects BNT*/
    $(".mainProjectsList").on('click', function () {
        $(this).children(".mainProjectName").toggleClass("activeClass");
        $(".modulesMenuIcons.active").toggleClass("hidden");
        $(".MainProjectsMenu.active").toggleClass("hidden");

        $(".ProjectsUlList").toggleClass("active");
        $(".ProjectsUlList").toggleClass("hidden");
    });
    /**/
    $(".backtoProjects").on('click', function () {
        $(".modulesMenuIcons").addClass("hidden");
        $(".modulesMenuIcons").removeClass("active");
        $(".MainProjectsMenu").addClass("active");
        $(".MainProjectsMenu").removeClass("hidden");
    });
    /**/
    $(".EastWestProject>ul>li, .backToModules").on('click', function () {
        $(".modulesMenuIcons").addClass("active");
        $(".modulesMenuIcons").removeClass("hidden");
        $(".MainProjectsMenu").addClass("hidden");
        $(".MainProjectsMenu").removeClass("active");
    });


    /*Projects ul*/
    $(".EastMainLi").on('click', function () {
        $(this).parent().children("ul").slideToggle(300);
        $(this).toggleClass("EastMainLiArrow");
    });
    /*Back to Projects*/
    /**/


    /**************** End Main Navigation Function ****************/

    // $(".thead-row .tableCell-3").resizable({
    //     minWidth: 75,
    //     alsoResize: ".normalContent .tableCell-3",
    //     handles: "e"
    // });

    // $(".thead-row .tableCell-4").resizable({
    //     minWidth: 100,
    //     handles: "e",
    //     alsoResize: ".normalContent .tableCell-4"
    // });

    // $(".thead-row .tableCell-5").resizable({
    //     minWidth: 100,
    //     handles: "e",
    //     alsoResize: ".normalContent .tableCell-5"
    // });

    // $(".thead-row .tableCell-6").resizable({
    //     minWidth: 120,
    //     handles: "e",
    //     alsoResize: ".normalContent .tableCell-6"
    // });

    // $(".thead-row .tableCell-7").resizable({
    //     minWidth: 100,
    //     handles: "e",
    //     alsoResize: ".normalContent .tableCell-7"
    // });

    // $(".thead-row .tableCell-8").resizable({
    //     minWidth: 100,
    //     handles: "e",
    //     alsoResize: ".normalContent .tableCell-8"
    // });






    if ($('body').css('direction').toLowerCase() == 'ltr'){
        $(".thead-row .tableCell-3").resizable({
            minWidth: 75,
            alsoResize: ".normalContent .tableCell-3",
            handles: "e"
        });
    
        $(".thead-row .tableCell-4").resizable({
            minWidth: 100,
            handles: "e",
            alsoResize: ".normalContent .tableCell-4"
        });
    
        $(".thead-row .tableCell-5").resizable({
            minWidth: 100,
            handles: "e",
            alsoResize: ".normalContent .tableCell-5"
        });
    
        $(".thead-row .tableCell-6").resizable({
            minWidth: 120,
            handles: "e",
            alsoResize: ".normalContent .tableCell-6"
        });
    
        $(".thead-row .tableCell-7").resizable({
            minWidth: 100,
            handles: "e",
            alsoResize: ".normalContent .tableCell-7"
        });
    
        $(".thead-row .tableCell-8").resizable({
            minWidth: 100,
            handles: "e",
            alsoResize: ".normalContent .tableCell-8"
        });
    }else {
        $(".thead-row .tableCell-3").resizable({
            minWidth: 75,
            alsoResize: ".normalContent .tableCell-3",
            handles: "w",
        });
        $(".thead-row .tableCell-4").resizable({
            minWidth: 100,
            handles: "w",
            alsoResize: ".normalContent .tableCell-4",
        });
        $(".thead-row .tableCell-5").resizable({
            minWidth: 100,
            handles: "w",
            alsoResize: ".normalContent .tableCell-5",
        });
        $(".thead-row .tableCell-6").resizable({
            minWidth: 120,
            handles: "w",
            alsoResize: ".normalContent .tableCell-6"
        });
        $(".thead-row .tableCell-7").resizable({
            minWidth: 100,
            handles: "w",
            alsoResize: ".normalContent .tableCell-7"
        });
        $(".thead-row .tableCell-8").resizable({
            minWidth: 100,
            handles: "w",
            alsoResize: ".normalContent .tableCell-8"
        });




    $(".thead-row .headCell").resize(function(){
        $(this).css("left","0");
    });


    }






    /*
    $(".gridTableContent").sortable();
    */


    /**********  Start CheckBox  **********/
    $('.ui.checkbox').checkbox(
        /*   {
                onChange: function () {
                         var
                             $input = $(this),
                             checked = $input.is(':checked');

                         if (checked) {
                             $input.parents('.gridMainRow').addClass('activeColor');

                         } else {
                             $input.parents('.gridMainRow').removeClass('activeColor');
                         }
                     }
          }*/
    );
    /***********   End  CheckBoxes   ************/


    /*Choice Card Active Class*/
    $(".choiceCardsUL li").on('click', function () {
        $(this).addClass('activeChiceCard').siblings().removeClass('activeChiceCard');
    });

    /*paginationNumbers*/
    $(".paginationNumbers li").on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
    });

    /*Start PopUp*/

    $(".popUpClickContainer .button").on('click', function () {
        $(this).parent().children(".popupClickContent").toggleClass("show");
    });

    $(document).on('click', function () {
        $('.popupClickContent').removeClass("show");
    });
    
    $('.popUpClickContainer').on('click', function (e) {
        e.stopPropagation();
    });

    /*****************  STart Inputs JS  ****************/
    /*    $(".inputDev input").focusin(function () {
            $(this).parent().parent(".form-group").css("background-color", "#f7f9fa");
        });
        $(".inputDev input").focusout(function () {
            $(this).parent().parent(".form-group").css("background-color", "#fafbfc");
        });*/
    /*With 2 side */
    /*    $(".linebylineInput input").focusin(function () {
            $(this).parent(".inputDev").css("background-color", "#f7f9fa");
        });
        $(".linebylineInput input").focusout(function () {
            $(this).parent(".inputDev").css("background-color", "#fafbfc");
        });*/
    $(function () {
        $(".passwordInputs .inputsideNote").on('click', function () {
            $(this).toggleClass("active-pw");
            if ($(this).hasClass("active-pw")) {
                $(this).next("input").attr("type", "text");
            } else {
                $(this).next("input").attr("type", "password");
            }
        });

    });
    //input Validator
    $(".inputPassContainer input").on("change keyup", function () {
        var upperCase = new RegExp('[A-Z]');
        if ($(this).val().match(upperCase)) {
            $(this).parent().addClass("uppercase");
            $(this).parent().removeClass("nouppercase");

        } else {
            $(this).parent().removeClass("uppercase");
            $(this).parent().addClass("nouppercase");
        }

        if ($(this).val().length >= 8) {
            $(this).parent().addClass("has8letters");
            $(this).parent().removeClass("nohas8letters");
        } else {
            $(this).parent().removeClass("has8letters");
            $(this).parent().addClass("nohas8letters");
        }
    });
    /*****************  End Inputs JS  ****************/

    /*****************  Start Submittal Tabs JS  ****************/
    $('.subitTabs li, .settings-tabs-items li, .setting-mini-tabs  li, .dashboard-ul li, .sparktabsUl li').tab();
    /*****************  End Submittal Tabs JS  ****************/


    /***********   Start Gird Function   ************/

    //Select All Check Box and Active Counter


    // Func To Count Checked Boxes (1)
    /*       var
               count = 0,
               checkboxes = $('.mainGridSystem .count input[type="checkbox"]');
           checkboxes.change(function () {
               if ((count = $('.count input[type="checkbox"]:checked').length)) {
                   $("#count-checked-checkboxes").text(count);
                   $(".gridSystemSelected").addClass("active");
                   $(".checkall").parent().addClass("active");
               } else {
                   $("#count-checked-checkboxes").empty();
                   $(".checkall").parent().removeClass("active");
                   $(".gridSystemSelected").removeClass("active");
               }
           });*/

    // Other Func To Count Checked Boxes (2)
    var $checkboxes = $('.count input[type="checkbox"]');
    $checkboxes.change(function () {
        var countCheckedCheckboxes = $checkboxes.filter(':checked').length;
        if (countCheckedCheckboxes) {
            $("#count-checked-checkboxes").text(countCheckedCheckboxes);
            $(".gridSystemSelected").addClass("active");
            $(".checkall").parent().addClass("active");
            $(".datagrid-scroll").addClass("hide");

        } else {
            $("#count-checked-checkboxes").empty();
            $(".checkall").parent().removeClass("active");
            $(".gridSystemSelected").removeClass("active");
            $(".datagrid-scroll").removeClass("hide");

        }
    });
    $('.ui.checkbox.count').checkbox({
        onChange: function () {
            var
                $input = $(this),
                checked = $input.is(':checked');
            if (checked) {
                $input.parents('.gridMainRow').addClass('activeColor');

            } else {
                $input.parents('.gridMainRow').removeClass('activeColor');
            }
        }
    });




    // Check all checkbox
    $('.gridSystemTables .ui.checkbox.checkall').checkbox({
        onChecked: function () {
            $('.gridSystemTables .ui.checkbox').checkbox('check');
        },
        onUnchecked: function () {
            $('.gridSystemTables .ui.checkbox').checkbox('uncheck');
        }
    });
    // End Select All Check Box and Active Counter

    $(".H-tableSize").on('click', function () {
        $(this).toggleClass("active");
        $(".gridMainRow").toggleClass("minimize");
    });

    $(".V-tableSize").on('click', function () {
        $(this).toggleClass("active");
    });

    $(".headCell.sort").on('click', function () {
        $(this).toggleClass("active").siblings().removeClass("active");
    });

    /*Start Grid Fixed Scroll*/
    $(".datagrid-scroll").scroll(function () {
        $(".gridSystemTables").scrollLeft($(".datagrid-scroll").scrollLeft());
    });

    $(".gridSystemTables").scroll(function () {
        $(".datagrid-scroll").scrollLeft($(".gridSystemTables").scrollLeft());
    });
    /**/
    $(".girdTableHeader").scroll(function () {
        $(".gridSystemTables").scrollLeft($(".girdTableHeader").scrollLeft());
    });

    $(".gridSystemTables").scroll(function () {
        $(".girdTableHeader").scrollLeft($(".gridSystemTables").scrollLeft());
    });
    
    
    
    
    $(".card-status").scroll(function () {
        $(".card-status").scrollLeft($(".card-status").scrollLeft());
    });
    /**/

    /*Scrolllbar for gird*/
    $(".gridSystemTables, .girdTableHeader, .gridTableContent").hover(function () {
        var theadRow = $(".thead-row").width(),
            stickyHead = $(".stickyHead").width(),
            tabWidth = stickyHead + theadRow;

        $(".datagrid-scroll div").css({
            "width": tabWidth
        });
    });

    $(window).on('load', function () {
        var theadRow = $(".thead-row").width(),
            stickyHead = $(".stickyHead").width(),
            tabWidth = stickyHead + theadRow;

        $(".datagrid-scroll div").css({
            "width": tabWidth
        });
    });

    $(window).resize(function () {
        var theadRow = $(".thead-row").width(),
            stickyHead = $(".stickyHead").width(),
            tabWidth = stickyHead + theadRow;

        $(".datagrid-scroll div").css({
            "width": tabWidth
        });
    });
    /**/
    $(window).on('load', function () {
        var grigHeight = $(".gridTableContent").height(),
            divHeight = $(".ScrollBar").height(),
            totalHeight = divHeight + grigHeight;

        $(".ScrollBar").css({
            "height": totalHeight + 78
        });
    });

    $(".H-tableSize").on('click', function () {
        var grigHeight = $(".gridTableContent").height(),
            divHeight = $(".ScrollBar").height(),
            totalHeight = divHeight + grigHeight;

        $(".ScrollBar").css({
            "height": totalHeight - grigHeight
        });
    });

    $(window).on("scroll", function () {
        var scrollDistance = $(window).scrollTop();
        // Assign active class to nav links while scolling
        $('.mainGridSystem').each(function (i) {
            if ($(this).offset().top <= scrollDistance + 40) {
                $(this).eq(i).addClass('active');
                $('.girdTableHeader').css("overflow", "hidden");

            } else if ($(this).offset().top >= scrollDistance - 40) {
                $(this).eq(i).removeClass('active');
                $('.girdTableHeader').css("overflow", "hidden");
            }
        });
    });
    /*End Grid */

    /*Doc Approval Function*/
    $(function () {
        var step = 0,
            stepItem = $('.docApprovalContainer .step-content-body');
        // Step Next
        $('.docApprovalContainer .step-content-btn').on('click', function () {
            var instance = $(this);

            $('.docApprovalContainer .step-content-btn-prev').removeClass('disabled');

            if (step === (stepItem.length - 2)) {
                instance.addClass('disabled');
            }

            $(stepItem[step + 1]);

            $('.docApprovalContainer .step-content-body').addClass('out');

            $(stepItem[step + 1]).removeClass('out');
            step += 1;
        });

        // Step Previous
        $('.docApprovalContainer .step-content-btn-prev').on('click', function () {
            var instance = $(this);

            if (step === (stepItem.length - 2)) {
                $('docApprovalContainer .step-content-foot .step-content-btn').removeClass('disabled');
                instance.siblings('.step-content-btn').removeClass('out');
            }

            if (step <= 1) {
                instance.addClass('disabled');
                $('.docApprovalContainer .step-content-btn').removeClass('disabled');
            }
            $(stepItem[step - 1]);

            $('docApprovalContainer .docApprovalContainer .step-content-body').addClass('out');

            $(stepItem[step - 1]).removeClass('out').siblings().addClass("out");
            step -= 1;
        });
    });

    /* End Doc Approval Function*/

    /*Docuemnt Stepper */
    $(function () {
        var step = 0,
            stepItem = $('.doc-container .step-slider .step-slider-item');
        // Step Next
        $('.doc-container .step-content-foot .step-content-btn, .doc-container .slider-Btns').on('click', function () {
            var instance = $(this);
            $('.doc-container .step-content-foot .step-content-btn-prev').removeClass('disabled');

            if (step === (stepItem.length - 2)) {
                instance.addClass('disabled');

            }
            $(stepItem[step + 1]).addClass('active');

            $('.doc-container .step-content-body').addClass('out');

            $('#' + stepItem[step + 1].dataset.id).removeClass('out');
            step += 1;
        });

        // Step Previous
        $('.doc-container .step-content-foot .step-content-btn-prev').on('click', function () {
            var instance = $(this);
            if (step === (stepItem.length - 2)) {
                $('.doc-container .step-content-foot .step-content-btn').removeClass('disabled');
                instance.siblings('.doc-container .step-content-btn').removeClass('out');
            }
            if (step <= 1) {
                instance.addClass('disabled');
            }
            $(stepItem[step]).removeClass('active');
            $('.doc-container .step-content-body').addClass('out');
            $('#' + stepItem[step - 1].dataset.id).removeClass('out');
            step -= 1;
        });
    });

    /**/

    $('.step-content-body .valid-input input').change(function () {
        var empty = false;
        $('.step-content-body .valid-input input').each(function () {
            if ($(this).val() === '') {
                empty = true;
            }
        });

        if (empty) {
            $('.next-btn').addClass('disabled');
        } else {
            $('.next-btn').removeClass('disabled');
        }
    });
    /*End Docuemnt Stepper */

    /*Date Picker Functions*/
    $('.NormalInputDate').datepicker({
        todayHighlight: true,
        todayBtn: "linked",
        autoclose: true,
        format: "dd/mm/yyyy",
    });

    $('.rangeInputDate').datepicker({
        todayHighlight: true,
        todayBtn: "linked",
        autoclose: true,
        format: "dd/mm/yyyy",
    });
    /*End Date Picker Functions*/
    /*Date Fillter */
    /*    if (!typeof (Storage) !== 'undefined') {
            $('#yay').fadeIn('slow');
        } else {
            $('#ooh').fadeIn('slow');
        }*/


    /* get it */
    /*
    $('#set').click(function() {
      var test = $('#text').val();
      localStorage.setItem("test", test);
    });
     $('#val').text(localStorage.getItem("test"));


    $('#get').click(function() {
      $('#val').text(localStorage.getItem("test"));
    });

    $('#remove').click(function() {
      localStorage.removeItem("test");
    });
    */




    $(".fillter-button").click(function () {
        $(".gridfillter-container").slideToggle();
        $(".fillter-button .text").toggleClass("active");
    });

    //notifcation
    $(window).on('load', function () {
        $(".notificontainer").fadeIn(1000);
        setInterval(function () {
            $(".notificontainer").fadeOut(1000);
        }, 3000);
    });


    $('.drag').draggable({
        helper: "clone",
        revert: 'invalid'
    });

    $('.drsag').draggable({
        appendTo: 'body',

        helper: function () {
            //debugger;
            return $("<div></div>").append($(this).find('.drag').clone());
        }
        /*
            revert: true,
        */
    });
    $('#dropzone').droppable({
        activeClass: 'active',
        hoverClass: 'hover',
        accept: ":not(.ui-sortable-helper)", // Reject clones generated by sortable
        drop: function (e, ui) {
            var $el = $('<div class="drop-item">' + ui.draggable.text() + '</div>'),
                pText = $('#dropzone .content-p').text();
            $('#dropzone .content-p').detach();
            $('.mainGridSystem .datagrid-grouping').addClass("datagrid-dark");
            $el.append($('<button type="button" class="btn btn-default btn-xs remove">x</button>').click(function () {
                $(this).parent().detach();


                if (!$.trim($('.mainGridSystem .datagrid-grouping').html()).length) {
                    $('.mainGridSystem .datagrid-grouping').append('<p class="content-p">' + pText + '</p>');
                    $('.mainGridSystem .datagrid-grouping').removeClass("datagrid-dark");
                }


            }));
            $(this).append($el);
        }
    }).sortable({
        items: '.drop-item',
        sort: function () {
            // gets added unintentionally by droppable interacting with sortable
            // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
            $(this).removeClass("active");
        }
    });

    //   $('.sidebar__inner a').on('click', function (){
    //       $('.gridMainRow').append("<div class='grid-loading'> <span> </span> </div>");
    //       $("body").css("overflow-y","hidden");
    //        return false;
    //      $('.grid-loading').setTimeout( function(){ 
    //          $(this).fadeOut('slow');
    //      }, 7000);
    //      $('body').setTimeout( function (){
    //          $(this).css("overflow-y","scroll");
    //      }, 5000);
    //  });
    
    
    

    
 //////// attachment delete action
    
    
    var len = $(".attachmentPage .gridTableContent .gridMainRow").length;
        $("#pdfLength span").text(len);
    $(".attachRecycle").click(function () {
        $(this).closest('.gridMainRow').detach();
        len = $(".attachmentPage .gridTableContent .gridMainRow").length;
            $("#pdfLength span").text(len);
       // $(this).parent().parent().fadeOut('slow');
    });
    

});


    
/*Grid Sticky Function*/
/* 
var executeGroupBy;
   executeGroupBy('attention');*/

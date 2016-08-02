/*!
 
*
* jQuery-Based Tutorial Library v0.0.1
* http://claytonfreitas.com.br
* Copyright 2014, Clayton Freitas
*

*
* Date: Sat Apr 12 00:00:00 2014 -0300
*/

(function ($) {
    var methods = {
        currentStep: function () {

            var data = this.data('tutorialize');
            if (!data) {
                return -1;
            }
            return data.currentIndex;
        },
        showAction: function () {

            var data = this.data('tutorialize');
            var points = data.steps;
            if (points[data.currentIndex].element.length > 0 && points[data.currentIndex].element.substring(0, 1) != "#") {
                points[data.currentIndex].element = "#" + points[data.currentIndex].element;
            }

            if (points[data.currentIndex].onBeforeShow != null) {
                points[data.currentIndex].onBeforeShow();
            }
            var $divTip = this.find("#divTip");
            var $arrowImage = this.find("#arrow");
            var $btnPrev = this.find("#btnPrev");
            var $btnNext = this.find("#btnNext");

            if (data.currentIndex == 0) {
                $btnPrev.fadeOut();
            }
            else {
                $btnPrev.fadeIn();
            }


            if (data.currentIndex == points.length - 1) {
                $btnNext.fadeOut();
            }
            else {
                $btnNext.fadeIn();
            }

                $divTip.animate({ left: $divTip.offset().left - 50, top: $divTip.offset().top - 50 }, { duration: 350, easing: "swing", queue: false }).fadeOut();
       

            $('html, body').animate({ scrollTop: $(points[data.currentIndex].element).offset().top }, 1000, "swing", function () {

                var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                var arrowWidth = $arrowImage.width();
                var arrowHeight = $arrowImage.height();
                var elementLeft = $(points[data.currentIndex].element).offset().left;
                var elementTop = $(points[data.currentIndex].element).offset().top;
                var elementWidth = $(points[data.currentIndex].element).width();
                var elementHeight = $(points[data.currentIndex].element).height();


                var leftArrow = elementLeft - arrowWidth;
                var topArrow = elementTop;


                if (leftArrow + arrowWidth > windowWidth) {
                    leftArrow = windowWidth - arrowWidth - 10;
                }
                if (topArrow + arrowHeight > windowHeight) {
                    topArrow = windowHeight - arrowHeight - 10;
                }
                if (topArrow < 0) {
                    topArrow = 0;


                    topArrow = 50;
                }
                if (leftArrow < 0) {
                    leftArrow = 60;
                }

                var adjacente = leftArrow - elementLeft;
                var oposto = topArrow - elementTop;
                var angulo = Math.asin(oposto / adjacente);

            

                var left = $(points[data.currentIndex].element).offset().left + $arrowImage.width();
                var divTipWidth = $divTip.width();

                var top = $(points[data.currentIndex].element).offset().top + $arrowImage.height();
                var divTipHeight = $divTip.height();

                if (left + divTipWidth > windowWidth) {
                    left = windowWidth - divTipWidth - 10;
                }
                if (top + divTipHeight > windowHeight) {
                    top = windowHeight - divTipHeight - 10;
                }

                $arrowImage.animate({ "z-index": 9999, left: leftArrow, top: topArrow }, { duration: 500, easing: "swing", queue: true }).fadeIn();
                    $divTip.animate({ "z-index": 9999, left: left, top: top }, { duration: 500, easing: "swing", queue: false
                                    , complete: function () {

                                        if (points[data.currentIndex].onShow != null) {
                                            points[data.currentIndex].onShow();
                                        }
                                    } 
                    }).fadeIn();
            });


            $divTip.find("#divTipContent").html(points[data.currentIndex].text);


        },
        init: function (options) {

            var $this = $(this);
            var data = $this.data('tutorialize');


            //            tutorialize = $('<div />', {
            //                text: $this.attr('title')
            //            });

            // If the plugin hasn't been initialized yet
            if (!data) {

                /*
                Do more setup stuff here
                */

                $(this).data('tutorialize', {
                    target: $this,
                    currentIndex: -1,
                    steps: options.steps,
                    close: options.close,
                    localization: options.localization
                });




                data = $(this).data('tutorialize');

                /***LOCALIZATION***/

                if (data.localization == null) {
                    data.localization = { NextText: "Next",
                        PreviousText: "Previous",
                        CloseText: "Close",
                        ArrowText: "Click to go to Next Tip"
                    };

                }

                if (data.localization.NextText == null) {
                    data.localization.NextText = "Next";
                }
                if (data.localization.PreviousText == null) {
                    data.localization.PreviousText = "Previous";
                }
                if (data.localization.CloseText == null) {
                    data.localization.CloseText = "Close";
                }
                if (data.localization.ArrowText == null) {
                    data.localization.ArrowText = "Click to go to Next Tip";
                }
                /***END LOCALIZATION***/



                //creating a div with another div for the content inside
                this.$divTip = $("<div id=\"divTip\" "
                                         +
                                         " style=\"background-color: #FFF; display:none; left:0px;top:0px; height: 200px; width: 400px; border: 1px solid #0000FF; position: absolute;\"> "
                                         +
                                         "  </div>")
                                .append($("<div id=\"divTipContent\">    </div>"));

                if (options.arrowImgSource != null) {
                    this.$arrowImage =
                         $("<img id='arrow' src='" + options.arrowImgSource + "' style='display:none;position:absolute' alt='" + data.localization.ArrowText + "'  />");

                    $(this).append(this.$arrowImage); // inserting the image in the parent element
                } else {


                    this.$arrowImage = $("<img id='arrow' style='display:none;height:0px;width:0px;position:absolute'  alt='" + data.localization.ArrowText + "'  />");

                    $(this).append(this.$arrowImage); // inserting the image in the parent element
                }


                $(this).append(this.$divTip); // inserting the div in the parent element


                var $bottomDiv = $("<div style=\"background-color:#E2EEFF\"></div>")

                //creating a button for the next Action
                var $btnNext = $("<input type=\"button\"  id=\"btnNext\"  value=\"" + data.localization.NextText + "\" />");
                var $btnPrev = $("<input type=\"button\"  id=\"btnPrev\"  value=\"" + data.localization.PreviousText + "\" />");
                var $btnClose = $("<input type=\"button\" id=\"btnClose\"  value=\"" + data.localization.CloseText + "\" />");
                //adding the button inside the bottom div
                $bottomDiv.append($btnPrev);
                $bottomDiv.append($btnNext);
                $bottomDiv.append($btnClose);

                //defining the parent of the button.
                $btnPrev.$tutorializeContainer = this;
                $btnNext.$tutorializeContainer = this;
                $btnClose.$tutorializeContainer = this;
                this.$arrowImage.$tutorializeContainer = this;

                //handling the click event 
                $btnPrev.click(function () {
                    // commanding the plugin to go to the next tutorial
                    $btnPrev.$tutorializeContainer.tutorialize("prevAction");
                });
                $btnNext.click(function () {
                    // commanding the plugin to go to the next tutorial
                    $btnNext.$tutorializeContainer.tutorialize("nextAction");
                });
                $btnClose.click(function () {
                    // commanding the plugin to go to the next tutorial
                    $btnClose.$tutorializeContainer.tutorialize("destroy");
                });
                if (this.$arrowImage) {
                    this.$arrowImage.click(function () {
                        // commanding the plugin to go to the next tutorial
                        $btnNext.$tutorializeContainer.tutorialize("nextAction");
                    });
                }



                //adding the bottom div  inside the master div
                this.$divTip.prepend($bottomDiv);


                this.$divTip.find("#divTip input:submit,input:reset,input:button,.button,.ui-datepicker-trigger").button();
            }


            return this;
        }
        ,
        destroy: function () {


            data = this.data('tutorialize');

            if (data.close != null) {
                data.close();
            }
            this.$divTip.fadeOut();
            this.$arrowImage.fadeOut();
            this.remove(this.$divTip);

            return this.removeData('tutorialize');

            //  var $this = $(this);
            // var data = $this.data('tutorialize');

            // Namespacing FTW
            //$(window).unbind('.tooltip'); 



        },
        nextAction: function () {

            data = this.data('tutorialize');
            if (data) {
                var points = data.steps;
                var $currentIndex = data.currentIndex;
                var $divTip = this.find("#divTip");
                if ($currentIndex + 1 < points.length) {

                    data.currentIndex++;
                    this.tutorialize("showAction"); //shows the current Index's content
                }
            }
            return this;
        },
        prevAction: function () {

            data = this.data('tutorialize');
            if (data) {
                var points = data.steps;
                var $currentIndex = data.currentIndex;
                var $divTip = this.find("#divTip");
                if ($currentIndex > 0) {

                    data.currentIndex--;
                    this.tutorialize("showAction"); //shows the current Index's content
                }
            }
            return this;

            // the this keyword is a DOM element
        }

    }

    $.fn.tutorialize = function (method, options) {

  
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tutorialize');
        }

    };
})(jQuery);

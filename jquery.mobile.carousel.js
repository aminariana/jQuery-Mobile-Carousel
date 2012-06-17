/*!
 * jQuery Mobile Carousel
 * Source: https://github.com/blackdynamo/jQuery-Mobile-Carousel
 * This fork: https://github.com/aminariana/jQuery-Mobile-Carousel
 * Demo: http://jsfiddle.net/blackdynamo/yxhzU/
 * Blog: http://developingwithstyle.blogspot.com
 *
 * Copyright 2010, Donnovan Lewis
 * Edits: Benjamin Gleitzman (gleitz@mit.edu)
 * Edits: Amin Ariana (amin@aminariana.com) May 2012
 * Licensed under the MIT
 */

(function($) {
    $.fn.carousel = function(options) {
        var settings = {
            duration: 300,
            direction: "horizontal",
            minimumDrag: 20,
            beforeStart: function(){},
            afterStart: function(){},
            beforeStop: function(){},
            afterStop: function(){}
        };

        $.extend(settings, options || {});

        return this.each(function() {
            if (this.tagName.toLowerCase() != "ul") return;

            var originalList = $(this);
            var pages = originalList.children();
            var width = originalList.parent().width();
            var height = originalList.parent().height();

            //Css
            var containerCss = {position: "relative", overflow: "hidden", width: "100%"};
            var listCss = {position: "relative", padding: "0", margin: "0", listStyle: "none"};
            var listItemCss = {width: "100%"};

            var container = $("<div>").css(containerCss);
            var list = $("<ul>").css(listCss);

            var currentPage = 1, start, stop;
            if (settings.direction.toLowerCase() === "horizontal") {
                list.css({float: "left", width: pages.length * 100 + "%"});

                $.each(pages, function(i) {
                    $("<li>")
                      .css($.extend(listItemCss, {float: "left", width: 100 / pages.length + "%"}))
                      .html($(this).html())
                      .appendTo(list);
                });

                function getPageLeft(page) {
                    return -1 * list.parent().width() * (page - 1);
                }

                // Scroll back to the correct item if browser size or mobile orientation changes.
                $(window).resize(function() {
                  list.stop().animate({ left: getPageLeft(currentPage) }, settings.duration);
                })

                list.draggable({
                    axis: "x",
                    start: function(event) {
                        settings.beforeStart.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;
                        start = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        settings.afterStart.apply(list, arguments);
                    },
                    stop: function(event) {
                        settings.beforeStop.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;
                        stop = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        start.coords[0] > stop.coords[0] ? moveLeft() : moveRight();

                        function moveLeft() {
                            if (currentPage !== pages.length && isDragIntended())
                                currentPage++;
                            
                            list.animate({ left: getPageLeft(currentPage) }, settings.duration);
                        }

                        function moveRight() {
                            if (currentPage !== 1 && isDragIntended())
                                currentPage--;

                            list.animate({ left: getPageLeft(currentPage)}, settings.duration);
                        }

                        function isDragIntended() {
                            return dragDelta() >= settings.minimumDrag;
                        }

                        function dragDelta() {
                            return Math.abs(start.coords[0] - stop.coords[0]);
                        }

                        settings.afterStop.apply(list, arguments);
                    }
                });
            } else if (settings.direction.toLowerCase() === "vertical") {
                container.css({height: height})
                
                $.each(pages, function(i) {
                    var li = $("<li>")
                            .css(listItemCss)
                            .css({height: height})
                            .html($(this).html());
                    list.append(li);
                });

                list.draggable({
                    axis: "y",
                    start: function(event) {
                        settings.beforeStart.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;
                        start = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        settings.afterStart.apply(list, arguments);
                    },
                    stop: function(event) {
                        settings.beforeStop.apply(list, arguments);

                        var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;
                        stop = {
                            coords: [ data.pageX, data.pageY ]
                        };

                        start.coords[1] > stop.coords[1] ? moveUp() : moveDown();

                        function moveUp() {
                            if (currentPage === pages.length || dragDelta() < settings.minimumDrag) {
                                list.animate({ top: "+=" + dragDelta()}, settings.duration);
                                return;
                            }
                            var new_width = -1 * height * currentPage;
                            list.animate({ top: new_width}, settings.duration);
                            currentPage++;
                        }

                        function moveDown() {
                            if (currentPage === 1 || dragDelta() < settings.minimumDrag) {
                                list.animate({ top: "-=" + dragDelta()}, settings.duration);
                                return;
                            }
                            var new_width = -1 * height * (currentPage - 2);
                            list.animate({ top: new_width}, settings.duration);
                            currentPage--;
                        }

                        function dragDelta() {
                            return Math.abs(start.coords[1] - stop.coords[1]);
                        }

                        settings.afterStop.apply(list, arguments);
                    }
                });
            }

            container.append(list);

            originalList.replaceWith(container);
        });
    };
})(jQuery);

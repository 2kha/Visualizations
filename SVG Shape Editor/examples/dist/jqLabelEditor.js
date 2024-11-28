
/**
 * @summary     Label Editor
 * @description Visualization for Polygons
 * @version     1.0.3
 * @file        jqLabelEditor
 * @author      2KHA 
 * @contact     tla.atc.co.nl@gmail.com
 * @copyright   Copyright (C) Mango AI.
 *
 * This source file is free software, available under the following license:
 *    GNU GENERAL PUBLIC LICENSE license - https://github.com/2kha/Visualizations/blob/main/LICENSE
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 * 
 */



;(function ($) {

    $.fn.jqLabelEditor = function (options) {

        var map = this;
        var svg = null;

        var selectable = false;

        options = options || {};

        options.mode = options.mode || 1;


        var shape = false;

        var origin = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0
        };

		var applyRotation = function (x = 0, y = 0, beta = 0, dx = 0, dy = 0) {

			var angle = beta * Math.PI / 180;

			var tx = parseFloat((x * Math.cos(angle)) - (y * Math.sin(angle)));
			var ty = parseFloat((x * Math.sin(angle)) + (y * Math.cos(angle)));

			return [tx, ty];
		}

        var applyZoom = function (element, scale) {
            $(element).attr('transform', 'scale(' + scale + ')');
        }

        var applyTransform = function (element, transX, transY, cx = 0, cy = 0, angle = 0) {

            $(element).attr('transform', 'translate(' + transX + ', ' + transY + ') rotate(' + angle + ',' + cx + ',' + cy + ')');
        };

        var addGroup = function(parent, x, y) {

            var group = parent.append("g")
                            .attr("class", "group tentative")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("transform", "translate(0,0) rotate(0)");
            return group;
        }

        var addCircle = function(parent, x, y, radius, name) {

            var circle = parent.append("circle")
                            .attr("class", name)
                            .attr("cx", x)
                            .attr("cy", y)
                            .attr("r", radius)
                            .attr("style", "fill:blue;stroke:blue;stroke-width:2;");

            return circle;
        }

        var adjustCircle = function (circle, x, y, radius) {
            circle.attr("cx", x)
                  .attr("cy", y)
                  .attr("r", radius);
        }



        var addRectangle = function(parent, x, y, width, height, name) {

            var rectangle = parent.append("rect")
                            .attr("class", name)
                            .attr("x", x)
                            .attr("y", y)
                            .attr("width", width)
                            .attr("height", height)
                            .attr("style", "cursor:pointer;fill:blue;stroke:blue;stroke-width:2;fill-opacity:0.1;stroke-opacity:0.9");

            return rectangle;
        }

        var adjustRectangle = function (rectangle, x, y, width, height) {

            rectangle.attr("x", x)
                     .attr("y", y)
                     .attr("width", width)
                     .attr("height", height);
        }

        var addLine = function(parent, x, y, lx, ly, name) {

            var path = parent.append("line")
              .attr("x1",x)
              .attr("y1", y)
              .attr('x2', lx)
              .attr("y2", ly)
              .attr("class", name)
              .attr("style", "stroke: blue; stroke-width: 2;");



            return path;
        }

        var adjustLine = function (line, x, y, lx, ly) {
            line.attr("x1",x)
              .attr("y1", y)
              .attr('x2', lx)
              .attr("y2", ly);
        }

        var addPolygon = function (parent, points, name) {

           var polygon = parent.append("polygon")
            .attr("class", name)
            .attr("points", points);

           return polygon;
        }

        var adjustPolygon = function(polygon, points) {
            polygon.attr("points", points);
        }

        var getPolygonPoints = function (parent) {

              var points = [];

              var markers = parent.selectAll(".mark").each(function (d, j) {

                    points.push([d3.select(this).attr("cx"), d3.select(this).attr("cy")].join(","));
              });

              return points;
        }

        var addPolygonGroup = function(parent, x, y) {

            var polygon = {};

            var radius = 5;

            var tentatives = d3.selectAll(".tentative");

            var incomplete = tentatives.size() > 0;

            if (incomplete) {

                var group = d3.select(tentatives.nodes()[0]);

                polygon.Group = group;

                polygon.Polygon = group.select("polygon")

                var first = group.select(".start");
                var last = group.select(".stop");

                last.classed("stop", false);

                var fx = parseFloat(first.attr("cx"));
                var fy = parseFloat(first.attr("cy"));

                var lx = parseFloat(last.attr("cx"));
                var ly = parseFloat(last.attr("cy"));

                var dx = Math.abs(fx - x);
                var dy = Math.abs(fy - y);

                var overlap = dx <= 5 && dy <= 5;

                if (overlap) {

                   var line = addLine(group, lx, ly, fx, fy, "link");
                   var points = getPolygonPoints(group);

                   polygon.Polygon.attr("points", points);

                   group.attr("class", "group");

                   d3.selectAll(".mark").raise();

                }
                else {

                    var marker = addCircle(group, x, y, radius, "mark stop");
                    var line = addLine(group, lx, ly, x, y, "link");

                    d3.selectAll(".mark").raise();
                }

                return polygon;
            }
            else {

                var group =  addGroup(parent, x, y);
                var marker = addCircle(group, x, y, radius, "mark start stop");

                polygon.Group = group;
                polygon.Start = marker;
                polygon.Polygon = addPolygon(group, [], "poly");

                d3.selectAll(".mark").raise();
            }

            return polygon;
        }

        var getNearestLinks = function(group, x, y, offset) {

             var links = {};

             var lines = group.selectAll(".link").each(function (d, j) {
                var line = d3.select(this);

                var fx = parseFloat(line.attr("x1"));
                var fy = parseFloat(line.attr("y1"));
                var lx = parseFloat(line.attr("x2"));
                var ly = parseFloat(line.attr("y2"));

                var dfx = Math.abs(fx - x);
                var dfy = Math.abs(fy - y);

                var dlx = Math.abs(lx - x);
                var dly = Math.abs(ly - y);

                if (dfx <= offset && dfy <= offset) {
                    links.Head = line;
                }

                if (dlx <= offset && dly <= offset) {
                    links.Tail = line;
                }

            });

            return links;
        }

        var adjustPolygonGroup = function(group, corner, links, dx, dy) {

            var cx = parseFloat(corner.attr("cx"));
            var cy = parseFloat(corner.attr("cy"));

            var x = cx - dx;
            var y = cy - dy;

            adjustCircle(corner, x, y, 5);

            var lx = links.Head.attr("x2");
            var ly = links.Head.attr("y2");

            var fx = links.Tail.attr("x1");
            var fy = links.Tail.attr("y1");

            adjustLine(links.Head, x, y, lx, ly);
            adjustLine(links.Tail, fx, fy, x, y);

            var points = getPolygonPoints(group);

            group.select(".poly").attr("points", points);

        }

        var addBoxGroup = function(parent, x, y, width, height) {

            var box = {};

            var left = x;
            var top = y;

            var right = x + width;
            var bottom = y + height;

            var middle = left + width * 0.5;

            var offset = 40;

            var group = addGroup(parent, left, top);
            var rectangle = addRectangle(group, left, top, width, height, "box");

            box.Group = group;
            box.Box = rectangle;

            box.TopLeft = addCircle(group, left, top, 3, "handle tpl");
            box.TopRight = addCircle(group, right, top, 3, "handle tpr");
            box.BottomRight = addCircle(group, right, bottom, 3, "handle bml");
            box.BottomLeft = addCircle(group, left, bottom, 3, "handle bmr");

            box.Joint = addLine(group, middle, top, middle, top - offset, "joint");
            box.Knot = addCircle(group, middle, top - offset, 5, "knot");

            return box;
        }

        var adjustBoxHandles = function (group, left = 0, top = 0, width = 0, height = 0) {

           var box = group.select(".box");

           left = left != 0 ? left : parseFloat(box.attr("x"));
           top = top != 0 ? top : parseFloat(box.attr("y"));

           adjustRectangle(box, left, top, width, height);

           var right = left + width;
           var bottom = top + height;

           var middle = left + width * 0.5;

           var offset = 40;

           var handles = group.selectAll(".handle").nodes();

           adjustCircle(d3.select(handles[0]), left, top, 3);
           adjustCircle(d3.select(handles[1]), right, top, 3);
           adjustCircle(d3.select(handles[2]), right, bottom, 3);
           adjustCircle(d3.select(handles[3]), left, bottom, 3);

           var joint = group.select(".joint");

           adjustLine(joint, middle, top, middle, top - offset);

           var knot = group.select(".knot");

           adjustCircle(knot, middle, top - offset, 5);

        }

        var applyPolygonStyle = function (polygon) {

            polygon.selectAll(".mark").attr("style", "cursor:move;fill:white;stroke:green;stroke-width:2;");
            polygon.selectAll(".link").attr("style", "cursor:move;fill:green;stroke:green;stroke-width:2;");
            polygon.selectAll(".poly").attr("style", "cursor:pointer;fill:green;stroke:green;stroke-width:1;fill-opacity:0.1;stroke-opacity:0.9");
            polygon.selectAll(".start").attr("style", "cursor:move;fill:green;stroke:green;stroke-width:2;");

        }

         var applyPolygonSelection = function (polygon) {

            polygon.attr("class", "group selected");
            polygon.selectAll(".mark").attr("style", "cursor:move;fill:white;stroke:green;stroke-width:2;");
            polygon.selectAll(".link").attr("style", "cursor:move;fill:green;stroke:green;stroke-width:2;");
            polygon.selectAll(".poly").attr("style", "cursor:pointer;fill:green;stroke:green;stroke-width:1;fill-opacity:0.1;stroke-opacity:0.9");
            polygon.selectAll(".start").attr("style", "cursor:move;fill:green;stroke:green;stroke-width:2;");

        }

         var applyPolygonDeselection = function (polygon) {

            polygon.attr("class", "group");
            polygon.selectAll(".start").attr("style", "display:none;");
            polygon.selectAll(".mark").attr("style", "display:none;");
            polygon.selectAll(".link").attr("style", "display:none;");
        }

         var applyPolygonDeselections = function () {

            d3.selectAll(".selected").attr("class", "group");
            d3.selectAll(".start").attr("style", "display:none;");
            d3.selectAll(".mark").attr("style", "display:none;");
            d3.selectAll(".link").attr("style", "display:none;");
        }

        var applyBoxStyle= function (box) {

            box.select(".box").attr("style", "cursor:pointer;fill:blue;stroke:blue;stroke-width:2;fill-opacity:0.1;stroke-opacity:0.9");
            box.selectAll(".handle").attr("style", "fill:blue;stroke:blue;stroke-width:2;");
            box.select(".knot").attr("style", "cursor:move;fill:blue;stroke:blue;stroke-width:2;");
            box.select(".joint").attr("style", "cursor:move;fill:blue;stroke:blue; cursor:move;");

            box.select(".tpl").style("cursor", "nw-resize");
            box.select(".tpr").style("cursor", "ne-resize");
            box.select(".bml").style("cursor", "se-resize");
            box.select(".bmr").style("cursor", "sw-resize");
        }

        var applyBoxSelection = function (box) {

            box.attr("class", "group selected");
            box.select(".box").attr("style", "cursor:pointer;fill:blue;stroke:blue;stroke-width:2;fill-opacity:0.1;stroke-opacity:0.9");
            box.selectAll(".handle").attr("style", "fill:blue;stroke:blue;stroke-width:2;");
            box.select(".knot").attr("style", "cursor:move;fill:blue;stroke:blue;stroke-width:2;");
            box.select(".joint").attr("style", "cursor:move;fill:blue;stroke:blue; cursor:move;");

            box.select(".tpl").style("cursor", "nw-resize");
            box.select(".tpr").style("cursor", "ne-resize");
            box.select(".bml").style("cursor", "se-resize");
            box.select(".bmr").style("cursor", "sw-resize");
        }

        var applyBoxDeselection = function (box) {

            box.attr("class", "group");
            box.select(".box").attr("style", "cursor:pointer;fill:blue;stroke:blue;stroke-width:1;fill-opacity:0.1;stroke-opacity:0.9");
            box.selectAll(".handle").attr("style", "display:none;");
            box.select(".joint").attr("style", "display:none;");
            box.select(".knot").attr("style", "display:none;");
        }

         var applyBoxDeselections = function () {

            d3.selectAll(".selected").attr("class", "group");
            d3.selectAll(".box").attr("style", "cursor:pointer;fill:blue;stroke:blue;stroke-width:1;fill-opacity:0.1;stroke-opacity:0.9");
            d3.selectAll(".handle").attr("style", "display:none;");
            d3.selectAll(".joint").attr("style", "display:none;");
            d3.selectAll(".knot").attr("style", "display:none;");
        }


        function closestAngle (from, to) {
            return from + ((((to - from) % 360) + 540) % 360) - 180;
        }

        function lerp(x, y, a) {
             return x * (1 - a) + y * a;
        }

        function deltaTransformPoint(matrix, point)  {

            var dx = point.x * matrix.a + point.y * matrix.c + 0;
            var dy = point.x * matrix.b + point.y * matrix.d + 0;
            return { x: dx, y: dy };
        }

        function decomposeMatrix(matrix) {

            // @see https://gist.github.com/2052247

            // calculate delta transform point
            var px = deltaTransformPoint(matrix, { x: 0, y: 1 });
            var py = deltaTransformPoint(matrix, { x: 1, y: 0 });

            // calculate skew
            var skewX = ((180 / Math.PI) * Math.atan2(px.y, px.x) - 90);
            var skewY = ((180 / Math.PI) * Math.atan2(py.y, py.x));

            return {

                translateX: matrix.e,
                translateY: matrix.f,
                scaleX: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
                scaleY: Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d),
                skewX: skewX,
                skewY: skewY,
                rotation: skewX // rotation is the same as skew x
            };
        }

        var initDragDrop = function () {

            var mouseDown = false;

            var pressing = false;
            var dragging = false;

            var handling = false;
            var rotating = false;
            var resizing = false;
            var reshaping = false;

            var oldPageX, oldPageY;
            var newPageX, newPageY;

            var dragX, dragY;

            var rotateX, rotateY;
            var resizeX, resizeY;

            var reshapeX, reshapeY;

            var direction = -1;

            var tentative = false;

            var self = svg;

            self.isMoving = false;
            self.isMovingTimeout = false;

            self.transX = 0;
            self.transY = 0;
            self.x = 0;
            self.y = 0;
            self.width = 0;
            self.height = 0;
            self.cx = 0;
            self.cy =0;
            self.alpha = 0;
            self.delta = 0;

            $(self).unbind();

            $(self).mousemove(function (e) {

                if (mouseDown) {

                    newPageX = e.pageX;
                    newPageY = e.pageY;

                    if ($(".selected").length == 0) {

                        if (tentative) {

                            tentative = false;

                              var x = oldPageX - origin.x;
                              var y = oldPageY - origin.y;

                              var width = newPageX - oldPageX;
                              var height = newPageX - oldPageX;

                              if (shape) {

                                  var box = addBoxGroup(d3.select("svg"), x, y, width, height);

                                  applyBoxStyle(box.Group);

                                  applyBoxDeselection(box.Group);

                                  box.Group
                                    .on("mousedown", function(e) {

                                        var group = this;

                                        pressing = true;

                                        dragX = e.pageX;
                                        dragY = e.pageY;

                                        applyBoxDeselections();
                                        applyPolygonDeselections();

                                        applyBoxSelection(d3.select(group));

                                        var w = parseFloat(d3.select(group).select(".box").attr("width"));
										var h = parseFloat(d3.select(group).select(".box").attr("height"));

										self.x = x;
										self.y = y;                                     

										if (d3.select(group).node().transform.baseVal.length > 0)
										{
											self.transX = d3.select(group).node().transform.baseVal.getItem(0).matrix.e;
											self.transY = d3.select(group).node().transform.baseVal.getItem(0).matrix.f;
										}

										var rotations = map.getRotation(d3.select(group).node());

										if (d3.select(group).node().transform.baseVal.length > 1)
										{
											self.alpha = d3.select(group).node().transform.baseVal.getItem(1).angle;
										}

										self.width = w || width;
										self.height = h || height;

										self.cx = rotations[1] || self.x + self.width * 0.5;
										self.cy = rotations[2] || self.y + self.height * 0.5;

                                        return false;

                                    })
                                    .on("mousemove", function(e) {

                                        if (pressing && !rotating && !resizing) {
                                            dragging = true;

                                            self.transX -= (dragX - e.pageX);
                                            self.transY -= (dragY - e.pageY);

                                            dragX = e.pageX;
                                            dragY = e.pageY;
                                        }
                                    })
                                    .on("mouseup", function() {

                                         dragging = false;
                                         pressing = false;

                                         return false;
                                    })
                                    .on("mouseover", function() {
                                        selectable = true;
                                     })
                                    .on("mouseout", function() {
                                        selectable = false;
                                    });

                                  box.Knot
                                    .on("mousedown", function(e) {

                                        handling = true;
                                        return false;

                                    })
                                    .on("mousemove", function(e) {

                                        if (handling) {

                                            rotating = true;

                                            rotateX = e.pageX;
                                            rotateY = e.pageY;
                                        }

                                        return false;
                                    })
                                    .on("mouseup", function() {

                                         rotating = false;
                                         handling = false;

                                         return false;
                                    });

                                  box.Group.selectAll(".handle")
                                    .on("mousedown", function(e) {

                                        handling = true;

                                        var handle = d3.select(this);

                                        if (handle.classed("tpl")){
                                            direction = 0;
                                        }
                                        else if (handle.classed("tpr")) {
                                            direction = 1;
                                        }
                                        else if (handle.classed("bml")) {
                                            direction = 2;
                                        }
                                        else if (handle.classed("bmr")) {
                                            direction = 3;
                                        }
                                        else {
                                            direction = -1;
                                        }

                                        return false;

                                    })
                                    .on("mousemove", function(e) {

                                        if (handling) {

                                            resizing = true;

                                            resizeX = e.pageX;
                                            resizeY = e.pageY;
                                        }

                                        return false;
                                    })
                                    .on("mouseup", function() {

                                         resizing = false;
                                         handling = false;

                                         return false;
                                    });
                              }

                        }

                        if (!dragging && shape) {

                            self.width = (newPageX - oldPageX);
                            self.height = (newPageY - oldPageY);

                            self.cx = self.x + self.width * 0.5;
                            self.cy = self.y + self.height * 0.5;

                            adjustBoxHandles(d3.select(d3.selectAll(".group").nodes().reverse()[0]), 0, 0, self.width, self.height);

                        }
                    }
                    else {

                        if (handling && rotating) {

                            rotating = true;

                            var parent = d3.select(".selected");

                            d3.select("svg").style("cursor","move");

                            self.x = parseFloat(parent.select(".box").attr("x"));
                            self.y = parseFloat(parent.select(".box").attr("y"));

                            self.width = parseFloat(parent.select(".box").attr("width"));
                            self.height = parseFloat(parent.select(".box").attr("height"));

                            self.cx = self.x + self.width * 0.5;
                            self.cy = self.y + self.height * 0.5;

                            if (parent.node().transform.baseVal.length > 1)
                            {
                                self.alpha = parent.node().transform.baseVal.getItem(1).angle;
                            }
                            else {
                                self.alpha = 0;
                            }

                            var dx = (rotateX - e.pageX);
                            var dy = (rotateY - e.pageY);

                            var radians = Math.atan2(dy, dx);
                            var degree = (radians * (180 / Math.PI)) - 90;

                            self.delta = degree;

                            rotateX = e.pageX;
                            rotateY = e.pageY;

                            self.delta = closestAngle(self.alpha, self.delta);
                            self.alpha = lerp(self.alpha, self.delta, 0.02);
                        }
                        else if (handling && resizing) {

                            resizing = true;

                            var parent = d3.select(".selected");

                            self.x = parseFloat(parent.select(".box").attr("x"));
                            self.y = parseFloat(parent.select(".box").attr("y"));

                            var rotations = [];

							var angle = -1 * self.alpha;

							rotations = applyRotation((resizeX - e.pageX), (resizeY - e.pageY), angle);

							var dx = rotations[0];
							var dy = rotations[1];

                            if (direction == 0) {

                                self.x -= dx;
                                self.y -= dy;

                                self.width += dx;
                                self.height += dy;

                                d3.select("svg").style("cursor","nw-resize");

                            }
                            else if (direction == 1) {

                                self.y -= dy;

                                self.width -= dx;
                                self.height += dy;

                                d3.select("svg").style("cursor","ne-resize");
                            }
                            else if (direction == 2) {

                                self.width -= dx;
                                self.height -= dy;

                                d3.select("svg").style("cursor","se-resize");

                            }
                            else if (direction == 3) {

                                self.x -= dx;

                                self.width += dx;
                                self.height -= dy;

                                d3.select("svg").style("cursor","sw-resize");
                            }

                            self.cx = self.x + self.width * 0.5;
                            self.cy = self.y + self.height * 0.5;

                            resizeX = e.pageX;
                            resizeY = e.pageY;

                            adjustBoxHandles(parent, self.x, self.y, self.width, self.height);
                        }
                        else if (handling && reshaping) {

                            var group = d3.select(".selected");

                            var drx = reshapeX - e.pageX;
                            var dry = reshapeY - e.pageY;
                         
                            adjustPolygonGroup(group, self.handle, self.links, drx, dry);

                            reshapeX = e.pageX;
                            reshapeY = e.pageY;
                        }

                         if (dragging || rotating) {
                            applyTransform($(".selected").eq(0), self.transX, self.transY, self.cx, self.cy, self.alpha);
                        }

                    }

                    if (self.isMovingTimeout) {
                        clearTimeout(self.isMovingTimeout);
                    }                   
                }

                return false;

            }).mousedown(function (e) {

                mouseDown = true;

                if (!dragging) {

                    oldPageX = e.pageX;
                    oldPageY = e.pageY;

                    tentative = true;
                }

                return false;

            }).mouseup(function () {

                mouseDown = false;

                clearTimeout(self.isMovingTimeout);

                self.isMovingTimeout = setTimeout(function () {

                    dragging = false;
                    pressing = false;
                    rotating = false;
                    handling = false;
                    resizing = false;
                    reshaping = false;

                    d3.select("svg").style("cursor","");

                    tentative = false;
                   
                }, 100);

                return false;

            })
            .click(function() {

                   if ($(".selected").length == 0) {

                       if (!shape && !dragging && !rotating && !resizing && !selectable) {

                          var x = oldPageX - origin.x;
                          var y = oldPageY - origin.y;

                           var polygon = addPolygonGroup(d3.select("svg"), x, y);

                           applyPolygonStyle(polygon.Group);

                           polygon.Polygon
                            .on("mousedown", function(e) {

                                  if ($(".tentative").length == 0) {

                                       var group = d3.select(d3.select(this).node().parentNode);

                                        pressing = true;

                                        dragX = e.pageX;
                                        dragY = e.pageY;

                                        applyPolygonDeselections();
                                        applyBoxDeselections();

                                        applyPolygonSelection(group);

                                        if (group.node().transform.baseVal.length > 0)
                                        {
                                            self.transX = group.node().transform.baseVal.getItem(0).matrix.e;
                                            self.transY = group.node().transform.baseVal.getItem(0).matrix.f;
                                        }

                                        self.alpha= 0;

                                        self.width = 0;
                                        self.height = 0;

                                        self.cx = 0;
                                        self.cy = 0;
                                   }


                                    return false;

                             })
                            .on("mousemove", function(e) {

                                if (pressing && !rotating && !resizing) {
                                    dragging = true;

                                    self.transX -= (dragX - e.pageX);
                                    self.transY -= (dragY - e.pageY);

                                    dragX = e.pageX;
                                    dragY = e.pageY;
                                }
                            })
                            .on("mouseup", function() {

                                 dragging = false;
                                 pressing = false;

                                 return false;
                            })
                            .on("mouseover", function() {
                                selectable = true;
                             })
                            .on("mouseout", function() {
                                selectable = false;
                            });

                           polygon.Group.selectAll(".mark")
                                .on("mousedown", function(e) {

                                    handling = true;

                                    self.handle = d3.select(this);

                                    var cx = parseFloat(self.handle.attr("cx"));
                                    var cy = parseFloat(self.handle.attr("cy"));                                  

                                    var parent = d3.select(self.handle.node().parentNode);

                                    self.links = getNearestLinks(parent, cx, cy, 0);

                                    reshapeX = e.pageX;
                                    reshapeY = e.pageY;

                                    return false;

                                })
                                .on("mousemove", function(e) {

                                    if (handling) {

                                        reshaping = true;

                                        reshapeX = e.pageX;
                                        reshapeY = e.pageY;
                                    }

                                    return false;
                                })
                                .on("mouseup", function() {

                                     reshaping = false;
                                     handling = false;

                                     return false;
                                });


                       }
                   }

                  if (!selectable) {
                        if ($(".tentative").length == 0) {
                         applyBoxDeselections();
                         applyPolygonDeselections();
                     }
                  }



            })
            .mouseout(function () {

                if (mouseDown && dragging && rotating) {

                    clearTimeout(self.isMovingTimeout);

                    self.isMovingTimeout = setTimeout(function () {
                        mouseDown = false;
                    }, 100);

                    return false;
                }
            });
        }

        var initEvents = function() {

            $(".map-polygon").on("click", function() {

                shape = !shape;

                $(this).toggleClass("marked");

            });

            $(".map-delete").on("click", function () {

                $(map).find(".selected").remove();

            });
        }


        var initMap = function (displayBack) {

            $(map).append('<span class="map-delete">×</span>');
            $(map).append('<span class="map-polygon">&#10022;</span>');

            if (options.mode == 1) {
                shape = true;
                $(".map-polygon").click();
            }
            else {
                shape = false;
                $(".map-polygon").click();
            }

            svg = $(map).find('svg').eq(0);

            origin.x = $(svg).offset().left;
            origin.y = $(svg).offset().top;

            origin.dx = Math.abs($(svg).parent().parent().offset().left - $(svg).offset().left);
            origin.dy = Math.abs($(svg).parent().parent().offset().top - $(svg).offset().top);

            initEvents();
            initDragDrop();

        }

        initMap();
		
		map.getTranslation = function (element) {

			var parts = map.getTransformations(element);

			if (parts != null) {
				var translate = parts[0];

				var translation = translate.replace("translate(", "[")
				  .replace(")", "]");

				return JSON.parse(translation);
			}
			else {
				return [0, 0];
			}
		}

		  map.addTranslation = function (element, x, y) {

		  var tx = map.getTranslation(element);

		  var rotation = map.getTransformations(element)[1];

		  d3.select(element).attr("transform", 'translate(' + parseFloat(x + tx[0]) + ',' + parseFloat(y + tx[1]) + ') ' + rotation);
		}

		map.setTranslation = function (element, x, y) {

		  var rotation = map.getTransformations(element)[1];

		  d3.select(element).attr("transform", 'translate(' + parseFloat(x) + ',' + parseFloat(y) + ') ' + rotation);
		}

		map.addRotation = function (element, angle) {

		  var rx = map.getRotation(element);

		  var translation = map.getTransformations(element)[0];

		  d3.select(element).attr("transform", translation + ' rotate(' + parseFloat(angle + rx[0]) + ',' + rx[1] + "," + rx[2] + ")");
		}

		map.setRotation = function (element, angle) {

		  var rx = map.getRotation(element);

		  var translation = map.getTransformations(element)[0];

		  d3.select(element).attr("transform", translation + ' rotate(' + parseFloat(angle) + ',' + rx[1] + "," + rx[2] + ")");
		}

		map.getTransformations = function (element) {

		  var transform = d3.select(element).attr("transform");

		  var parts = transform.split(" ");

		  return parts;
		}

		map.getRotation = function (element) {

		  var parts = map.getTransformations(element);

		  if (parts != null) {
			  var rotate = parts[1];

			  var rotation = rotate.replace("rotate(", "[")
				  .replace(")", "]");

			  return JSON.parse(rotation);
		  }
		  else {
			  return [0, 0, 0];
		  }

		}


        return map;


    };

}(jQuery));



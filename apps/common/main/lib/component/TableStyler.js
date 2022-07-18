/*
 *
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
*/
/**
 *  TableStyler.js
 *
 *  Created by Alexander Yuzhin on 2/28/14
 *  Copyright (c) 2018 Ascensio System SIA. All rights reserved.
 *
 */

if (Common === undefined)
    var Common = {};

define([
    'common/main/lib/component/BaseView'
], function () {
    'use strict';
    Common.UI.CellBorder = function (options){
        var me =this;
        me.options = {
            x1                  : 0,
            y1                  : 0,
            x2                  : 0,
            y2                  : 0,
            scale               : 2,
            sizeCorner          : 10,
            clickOffset         : 10,
            overwriteStyle      : true,
            maxBorderSize       : 6,
            halfBorderSize      : false,
            defaultBorderSize   : 1,
            defaultBorderColor  : '#ccc'
        };

        for( var key in options) {
            me.options[key] = options[key];
        }

        var virtualBorderSize,
            virtualBorderColor,
            borderSize,
            borderColor,
            borderAlfa;

        me.id                   = me.options.id || Common.UI.getId();
        me.clickOffset          = me.options.clickOffset;
        me.overwriteStyle       = me.options.overwriteStyle;
        me.maxBorderSize        = me.options.maxBorderSize;
        me.halfBorderSize       = me.options.halfBorderSize;
        me.defaultBorderSize    = me.options.defaultBorderSize;
        me.defaultBorderColor   = me.options.defaultBorderColor;
        me.col                  = me.options.col;
        me.row                  = me.options.row;
        me.X1                   = me.options.x1;
        me.Y1                   = me.options.y1;
        me.X2                   = me.options.x2;
        me.Y2                   = me.options.y2;
        me.scale                = me.options.scale;
        me.context              = me.options.context;
        me.diff                 = 0.5 * me.scale;

        virtualBorderSize       = me.defaultBorderSize;
        virtualBorderColor      = new Common.Utils.RGBColor(me.defaultBorderColor);
        borderSize = virtualBorderSize;
        borderColor = virtualBorderColor;
        borderAlfa = 1;

        me.setBordersSize = function (size) {
            size = (size > this.maxBorderSize) ? this.maxBorderSize : size;
            me.diff = 0.5 * me.scale;
            borderSize = size;
            borderAlfa = (size<1) ? 0.3 : 1;
        };

        me.setBordersColor = function( color) {
            var newColor = color;
            if(typeof(color) == "string")
                newColor = new Common.Utils.RGBColor(color);
            borderColor = newColor;
        };

        me.getBorderSize = function() {
            return borderSize;
        };

        me.getBorderColor = function() {
            return borderColor.toHex();
        };

        me.setVirtualBorderSize = function(size) {
            virtualBorderSize = (size > this.maxBorderSize) ? this.maxBorderSize : size;
        };

        me.setVirtualBorderColor = function(color){
            /*var newColor = new Common.Utils.RGBColor(color);

            if (virtualBorderColor.isEqual(newColor))
                return;*/

            virtualBorderColor = color;
        };

        me.getVirtualBorderSize = function() {
            return virtualBorderSize;
        };

        me.getVirtualBorderColor = function() {
            return virtualBorderColor.toHex();
        };

        me.getLine = function (){
            if (me.Y1 == me.Y2)
                return {X1: me.X1, Y1: me.Y1 - me.diff, X2: me.X2, Y2: me.Y2- me.diff};
            else
                return {X1: me.X1 - me.diff, Y1: me.Y1, X2: me.X2 - me.diff, Y2: me.Y2};
        };

        me.inRect = function (MX, MY){
            var h = 5;
            var line =  me.getLine();
            line = {X1: line.X1/me.scale, Y1: line.Y1/me.scale, X2: line.X2/me.scale, Y2: line.Y2/me.scale};

            if (line.Y1 == line.Y2)
                return ((MX > line.X1 && MX < line.X2) && (MY > line.Y1 - h && MY < line.Y1 + h));
            else
                return((MY > line.Y1 && MY < line.Y2) && (MX > line.X1 - h && MX < line.X1 + h));
        };

        me.drawBorder = function (){
            if(borderSize == 0) return;
            var line =  me.getLine();
            me.context.beginPath();
            me.context.lineWidth = borderSize * me.scale;
            me.context.strokeStyle = me.getBorderColor();

            me.context.moveTo(line.X1, line.Y1);
            me.context.lineTo(line.X2, line.Y2);
            me.context.stroke();
        };

        me.setBorderParams = function (){
            if(borderSize == virtualBorderSize &&  virtualBorderColor.isEqual(borderColor) ){
                me.setBordersSize(0);
                return;
            }
            me.setBordersSize(virtualBorderSize);
            me.setBordersColor(virtualBorderColor);
        };

        me.redrawBorder =function() {
            if(me.X1==me.X2){
                me.context.clearRect(me.X1  - me.scale * borderSize/2 , me.Y1, borderSize * me.scale, me.Y2 - me.Y1);
            } else {
                me.context.clearRect(me.X1 , me.Y1  -me.scale * borderSize/2, me.X2 - me.X1,me.scale * borderSize);
            }
            me.setBorderParams();
            me.drawBorder();
        };
    }

    Common.UI.TableStyler = Common.UI.BaseView.extend({
        options : {
            width               : 200,
            height              : 200,
            rows                : 2,
            columns             : 2,
            cellPadding         : 10,
            tablePadding        : 10,
            overwriteStyle      : true,
            maxBorderSize       : 6,
            spacingMode         : false,
            defaultBorderSize   : 1,
            defaultBorderColor  : '#ccc',
            sizeConer           : 10,
            scale               : 2,
            row                 :-1,
            col                 :-1
        },

        template: _.template([
            '<div id="<%=scope.id%>" class="table-styler" style="position: relative; width: <%=scope.width%>px; height:<%=scope.height%>px;">',
            '<canvas id="<%=scope.id%>-table-canvas"  width ="<%=scope.width * scope.scale%>" height="<%=scope.height * scope.scale%>" style="left: 0; top: 0; width: 100%; height: 100%;">' +
            '<div class="ts-preview-box ts-preview-box--lt" style="left: 0; top: 0; width: <%=scope.tablePadding%>px; height: <%=scope.tablePadding%>px;"></div>'+
            '</canvas>',
            '</div>'
        ].join('')),

        initialize : function(options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);

            var me = this,
                virtualBorderSize,
                virtualBorderColor;

            me.id                   = me.options.id || Common.UI.getId();
            me.width                = me.options.width;
            me.height               = me.options.height;
            me.rows                 = me.options.rows;
            me.columns              = me.options.columns;
            me.cellPadding          = me.options.cellPadding;
            me.tablePadding         = me.options.tablePadding;
            me.overwriteStyle       = me.options.overwriteStyle;
            me.maxBorderSize        = me.options.maxBorderSize;
            me.spacingMode          = me.options.spacingMode;
            me.defaultBorderSize    = me.options.defaultBorderSize;
            me.defaultBorderColor   = me.options.defaultBorderColor;
            me.sizeCorner           = Math.ceil(me.options.sizeConer/4)*4;
            me.scale                = me.options.scale;
            me.backgroundColor      = 'transparent';
            me.ratio                = Common.Utils.zoom();

            virtualBorderSize       = (me.defaultBorderSize > me.maxBorderSize) ? me.maxBorderSize : me.defaultBorderSize;
            virtualBorderColor      = new Common.Utils.RGBColor(me.defaultBorderColor);

            var borderSize = {
                top     : virtualBorderSize,
                right   : virtualBorderSize,
                bottom  : virtualBorderSize,
                left    : virtualBorderSize
            };

            var borderColor = {
                top     : virtualBorderColor,
                right   : virtualBorderColor,
                bottom  : virtualBorderColor,
                left    : virtualBorderColor
            };

            me.rendered             = false;

            me.on('render:after', function(cmp) {


                me.canv.addEventListener('click', function (e) {
                    var mouseX, mouseY;

                    if (e.offsetX) {
                        mouseX = parseInt(e.offsetX * Common.Utils.zoom());
                        mouseY = parseInt(e.offsetY * Common.Utils.zoom());
                    } else if (e.originalEvent.layerX) {
                        mouseX = e.originalEvent.layerX;
                        mouseY = e.originalEvent.layerY;
                    }
                    var redraw = false;

                    if (me.inRect('t', mouseX, mouseY)) {
                        //me.redrawBorder('t');
                        me.setBorderParams('t');
                        redraw = true;
                    } else if (me.inRect('b', mouseX, mouseY)) {
                        //me.redrawBorder('b');
                        me.setBorderParams('b');
                        redraw = true;
                    } else if (me.inRect('l', mouseX, mouseY)) {
                        //me.redrawBorder('l');
                        me.setBorderParams('l');
                        redraw = true;
                    } else if (me.inRect('r', mouseX, mouseY)) {
                        //me.redrawBorder('r');
                        me.setBorderParams('r');
                        redraw = true;
                    } else {
                        for (var i = 0; i < me._borders.length; i++) {
                            if (me._borders[i].inRect(mouseX, mouseY)) {
                                //me._borders[i].redrawBorder();
                                me._borders[i].setBorderParams();
                                redraw = true;
                                me.fireEvent('borderclick:cellborder', me,  borderSize, borderColor.top.toHex());
                            }
                        }
                    }
                    (redraw) && me.redrawTable();
                });


            });

            me.getVirtualBorderSize = function(){
                return virtualBorderSize;
            };

            me.getVirtualBorderColor = function(){
                return virtualBorderColor.toHex();
            };

            me.setVirtualBorderSize = function(size){
                size = (size > me.maxBorderSize) ? me.maxBorderSize : size;

                virtualBorderSize = size;
                for(var i =0; i < me._borders.length; i++){
                    me._borders[i].setVirtualBorderSize(size);
                }
            };

            me.setVirtualBorderColor = function(color){
                var newColor = new Common.Utils.RGBColor(color);

                if (virtualBorderColor.isEqual(newColor))
                    return;

                virtualBorderColor = newColor;

                for(var i =0; i < me._borders.length; i++){
                    me._borders[i].setVirtualBorderColor(newColor);
                }
            };

            me.setBordersSize = function(borders, size){
                size = (size > me.maxBorderSize) ? me.maxBorderSize : size;

                if (borders.indexOf('t') > -1) {
                    borderSize.top = size;
                    borderColor.top.toRGBA((borderSize.top < 1)   ? 0.2 : 1);
                }
                if (borders.indexOf('r') > -1) {
                    borderSize.right = size;
                    borderColor.right.toRGBA((borderSize.right < 1)   ? 0.2 : 1);
                }
                if (borders.indexOf('b') > -1) {
                    borderSize.bottom = size;
                    borderColor.bottom.toRGBA((borderSize.bottom < 1)   ? 0.2 : 1);
                }
                if (borders.indexOf('l') > -1) {
                    borderSize.left = size;
                    borderColor.left.toRGBA((borderSize.left < 1)   ? 0.2 : 1);
                }



            };

            me.setBordersColor = function(borders, color){
                var newColor = new Common.Utils.RGBColor(color);

                if (borders.indexOf('t') > -1)
                    borderColor.top = newColor;
                if (borders.indexOf('r') > -1)
                    borderColor.right = newColor;
                if (borders.indexOf('b') > -1)
                    borderColor.bottom = newColor;
                if (borders.indexOf('l') > -1)
                    borderColor.left = newColor;

            };

            me.getBorderSize = function(border){
                switch(border){
                    case 't':
                        return borderSize.top;
                    case 'r':
                        return borderSize.right;
                    case 'b':
                        return borderSize.bottom;
                    case 'l':
                        return borderSize.left;
                }
                return null;
            };

            me.getBorderColor = function(border){
                switch(border){
                    case 't':
                        return borderColor.top.toHex();
                    case 'r':
                        return borderColor.right.toHex();
                    case 'b':
                        return borderColor.bottom.toHex();
                    case 'l':
                        return borderColor.left.toHex();
                }
                return null;
            };

            me.setBorderParams = function(border) {
                var color = new Common.Utils.RGBColor(me.getBorderColor(border));
                var size = me.getBorderSize(border);
                if(size == virtualBorderSize && virtualBorderColor.isEqual(color)) {
                    me.setBordersSize(border,0);
                    return;
                }
                me.setBordersSize(border, me.getVirtualBorderSize());
                me.setBordersColor(border,me.getVirtualBorderColor());
            };

            me.getLine =function  (borderWidth, border ){
                var sizeCornerScale = me.sizeCorner * me.scale;

                var linePoints={},
                    indent = sizeCornerScale + borderWidth/2 ,
                    canvWidth = me.width * me.scale,
                    canvHeight =me.height * me.scale;

                switch (border){
                    case 't':
                        linePoints.X1 = sizeCornerScale ;
                        linePoints.Y1 = indent;
                        linePoints.X2 = canvWidth - sizeCornerScale;
                        linePoints.Y2 = linePoints.Y1;
                        break;
                    case 'b':
                        linePoints.X1 = sizeCornerScale;
                        linePoints.Y1 = canvHeight - indent;
                        linePoints.X2 = canvWidth - sizeCornerScale;
                        linePoints.Y2 = linePoints.Y1;
                        break;
                    case 'l':
                        linePoints.X1 = indent;
                        linePoints.Y1 = sizeCornerScale;
                        linePoints.X2 = linePoints.X1;
                        linePoints.Y2 = canvHeight - sizeCornerScale;
                        break;
                    case 'r':
                        linePoints.X1 = canvWidth - indent;
                        linePoints.Y1 = sizeCornerScale;
                        linePoints.X2 = linePoints.X1;
                        linePoints.Y2 = canvHeight - sizeCornerScale;
                        break;
                }
                return linePoints;
            };

            me.setTableColor = function(color) {
                me.backgroundColor = (color == 'transparent' ) ? color : ('#'+color);
            };

            me.setCellsColor = function(color) {
                me.backgroundColor = (color == 'transparent' ) ? color : ('#'+color);
            };

            if (me.options.el) {
                me.render(null, {
                    borderSize: borderSize,
                    borderColor: borderColor,
                    virtualBorderSize: virtualBorderSize,
                    virtualBorderColor: virtualBorderColor
                });
            }
        },

        render : function(parentEl) {
            var me = this,
                cfg = arguments[1];

            this.trigger('render:before', this);

            if (!me.rendered) {
                this.cmpEl = $(this.template(_.extend({
                    scope: me
                }, cfg)));

                if (parentEl) {
                    this.setElement(parentEl, false);
                    this.setElement(parentEl, false);
                    parentEl.html(this.cmpEl);
                } else {
                    $(this.el).html(this.cmpEl);
                }
            } else {
                this.cmpEl = $(this.el);
            }
            me.canv = $('#' + me.id + '-table-canvas')[0];
            me.context = me.canv.getContext('2d');
            if (!me.rendered) {
                this._borders = [];
                var  cellBorder, opt, diff = me.scale;
                var stepX = (me.canv.width - 2 * me.sizeCorner * me.scale)/me.columns,
                    stepY = (me.canv.height - 2 * me.sizeCorner * me.scale)/me.rows;
                var generalOpt = {
                    scale   : me.scale,
                    context : me.context
                };
                for (var row = 0; row < me.rows - 1; row++) {
                    opt = generalOpt;
                    opt.y1 = Math.ceil(((row + 1) * stepY + me.sizeCorner  * me.scale));
                    opt.y2 = opt.y1;
                    opt.x1 = me.sizeCorner  * me.scale ;
                    opt.x2 = me.canv.width - me.sizeCorner  * me.scale ;
                    opt.row = row;
                    cellBorder = new Common.UI.CellBorder(opt);
                    this._borders.push(cellBorder);
                }

                for (var col = 0; col < me.columns - 1; col++) {
                    opt = generalOpt;
                    opt.y1 = me.sizeCorner  * me.scale ;
                    opt.y2 = me.canv.height - me.sizeCorner  * me.scale;
                    opt.x1 = Math.ceil(((col + 1) * stepX + me.sizeCorner  * me.scale)/4)*4;
                    opt.x2 = opt.x1;
                    opt.col = col;
                    cellBorder = new Common.UI.CellBorder(opt);
                    this._borders.push(cellBorder);
                }
                //this.drawCorners();
                this.drawTable();
            }

            me.rendered = true;

            this.trigger('render:after', this);

            return this;
        },

        drawCorners: function () {
            var me = this;
            var sizeCornerScale =me.sizeCorner*me.scale;
            var canvWidth = me.width*me.scale;
            var canvHeight = me.height*me.scale;

            me.context.lineJoin = 'meter';

            var diff = me.scale/2;

            me.context.beginPath();
            me.context.setLineDash([me.scale,me.scale]);

            me.context.moveTo(sizeCornerScale + diff, 0);
            me.context.lineTo(sizeCornerScale + diff, sizeCornerScale );

            me.context.moveTo(0, sizeCornerScale + diff);
            me.context.lineTo(sizeCornerScale + me.scale, sizeCornerScale + diff);


            me.context.moveTo(canvWidth - sizeCornerScale - diff, 0);
            me.context.lineTo(canvWidth - sizeCornerScale - diff, sizeCornerScale );

            me.context.moveTo(canvWidth, sizeCornerScale + diff);
            me.context.lineTo(canvWidth - sizeCornerScale - me.scale, sizeCornerScale + diff);


            me.context.moveTo(canvWidth - sizeCornerScale - diff, canvHeight);
            me.context.lineTo(canvWidth - sizeCornerScale - diff, canvHeight - sizeCornerScale - me.scale);

            me.context.moveTo(canvWidth, canvHeight - sizeCornerScale - diff);
            me.context.lineTo(canvWidth - sizeCornerScale - me.scale, canvHeight - sizeCornerScale - diff);


            me.context.moveTo(sizeCornerScale + diff, canvHeight);
            me.context.lineTo(sizeCornerScale + diff, canvHeight - sizeCornerScale - me.scale);

            me.context.moveTo(0, canvHeight - sizeCornerScale - diff);
            me.context.lineTo(sizeCornerScale + me.scale, canvHeight - sizeCornerScale - diff);


            me.context.lineWidth = me.scale;
            me.context.strokeStyle = "grey";
            me.context.stroke();
            me.context.setLineDash([]);
        },

        inRect: function(border,MX, MY) {
            var h = 5;
            var sizeBorder = this.getBorderSize(border)*this.scale;
            var line = this.getLine(sizeBorder, border);
            line = {X1: line.X1/this.scale, Y1: line.Y1/this.scale, X2: line.X2/this.scale, Y2: line.Y2/this.scale};

            if (line.Y1 == line.Y2)
                return ((MX > line.X1 && MX < line.X2) && (MY > line.Y1 - h && MY < line.Y1 + h));
            else
                return((MY > line.Y1 && MY < line.Y2) && (MX > line.X1 - h && MX < line.X1 + h));
        },

        drawBorder: function (border){
            var me = this;
            var size = me.getBorderSize(border);
            if(size == 0) return;
            me.context.imageSmoothingEnabled = false;
            me.context.mozImageSmoothingEnabled = false;
            me.context.msImageSmoothingEnabled = false;
            me.context.webkitImageSmoothingEnabled = false;
            me.context.lineWidth = size * me.scale;
            var points = me.getLine(me.context.lineWidth, border);
            me.context.beginPath();
            me.context.strokeStyle = me.getBorderColor(border);
            me.context.moveTo(points.X1, points.Y1);
            me.context.lineTo(points.X2, points.Y2);
            me.context.stroke();

        },




        drawTable: function (){
            this.drawCorners();

            var me = this;

            var diff = me.scale/2
            var sizeCornerScale = me.sizeCorner * me.scale + diff, tdPadding = 6 * me.scale;
            var tableWidth = me.width * me.scale - 2*sizeCornerScale,
                tdWidth = tableWidth/me.columns,
                tableHeight = me.height * me.scale - 2*sizeCornerScale, tdHeight = tableHeight/me.rows;


            if(me.backgroundColor != 'transparent' ){
                me.context.beginPath();
                me.context.fillStyle = me.backgroundColor;
                me.context.fillRect(sizeCornerScale + diff, sizeCornerScale + diff, tableWidth - 2 * diff, tableHeight - 2 * diff);
                me.context.stroke();
            }

            me.context.setLineDash([]);
            me.drawBorder('t');
            me.drawBorder('b');
            me.drawBorder('l');
            me.drawBorder('r');
            me.context.lineWidth = 0;

            me.context.beginPath();
            var img = new Image() ;

            img.onload = function (){
                var tdX, tdY, pattern, widthRightBorder = 0, widthBottomBorder = 0, widthLeftBorder,
                    yTop = sizeCornerScale, xLeft = sizeCornerScale,
                    widthTopBorder = me.getBorderSize('t') * me.scale;
                pattern = me.context.createPattern(img, "repeat");
                me.context.fillStyle = pattern;
                tdY = yTop;
                for (var row = 0; row < me.rows; row++) {
                    widthLeftBorder = me.getBorderSize('l') * me.scale;
                    widthBottomBorder = (row < me.rows-1) ? me.getBorder(row,-1).getBorderSize() * me.scale  / 2 : me.getBorderSize('b') * me.scale;
                    tdX = xLeft;
                    for (var col = 0; col < me.columns; col++) {
                        widthRightBorder = (col < me.columns-1) ? me.getBorder(-1, col).getBorderSize() * me.scale  / 2 : me.getBorderSize('r') * me.scale;
                        me.context.fillRect(tdX + tdPadding + widthLeftBorder, tdY + tdPadding + widthTopBorder, tdWidth - (2 * tdPadding + widthLeftBorder + widthRightBorder),tdHeight - (2 * tdPadding + widthTopBorder + widthBottomBorder));
                        tdX += tdWidth;
                        widthLeftBorder = widthRightBorder;
                    }
                    tdY += tdHeight;
                    widthTopBorder  = widthBottomBorder;
                }
            };
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAIAQMAAADk/cxGAAAABlBMVEVMaXHAwMBbbSKjAAAAAXRSTlMAQObYZgAAAA5JREFUeNpj+MAAgVAAAC0QA8HkpvUHAAAAAElFTkSuQmCC'; // full uri here
            me.context.stroke();

            me._borders.forEach(function (item){item.drawBorder();});
        },

        redrawBorder: function(border){
            var me = this;
            var context = me.canv.getContext('2d');
            var borderSizeScale = me.getBorderSize(border) * me.scale;
            var line = me.getLine(borderSizeScale, border);
            if(line.X1==line.X2){
                context.clearRect(line.X1 - borderSizeScale/2 , line.Y1, borderSizeScale, line.Y2-line.Y1);
            }
            else {
                context.clearRect(line.X1 , line.Y1 - borderSizeScale/2, line.X2-line.X1, borderSizeScale);
            }
            me.setBorderParams(border);
            me.drawBorder(border);
            me.fireEvent('borderclick', me, border, me.getBorderSize(border), me.getBorderColor(border));
        },

        getBorder: function(row, col){
            if(col<0)
                return _.findWhere(this._borders, { row:  row});
            else
                return _.findWhere(this._borders, {col:  col});
        },

        redrawTable: function() {
            var me = this;
            var context = me.canv.getContext('2d'), diff = me.scale;
            //context.clearRect(me.sizeCorner * me.scale + diff, me.sizeCorner * me.scale + diff, (me.width - 2*me.sizeCorner)*me.scale - 2*diff, (me.height - 2*me.sizeCorner)*me.scale - 2*diff);
            context.clearRect(0,0, me.canv.width, me.canv.height);
            me.drawTable();
        }
    });
});
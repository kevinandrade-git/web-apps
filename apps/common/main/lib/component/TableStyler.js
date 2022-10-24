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
            numInCell           : -1,
            sizeCorner          : 10,
            clickOffset         : 10,
            overwriteStyle      : true,
            maxBorderSize       : 8,
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
        me.numInCell            = me.options.numInCell;
        me.scale                = me.options.scale;
        me.context              = me.options.context;
        me.diff                 = 0.5 * me.scale;

        virtualBorderSize       = me.defaultBorderSize;
        virtualBorderColor      = new Common.Utils.RGBColor(me.defaultBorderColor);
        borderSize = virtualBorderSize;
        borderColor = virtualBorderColor;
        borderAlfa = 1;

        me.setBordersSize = function (size) {
            borderSize = (size > this.maxBorderSize) ? this.maxBorderSize : size;
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
            borderAlfa = (size<1) ? 0.3 : 1;
        };

        me.setVirtualBorderColor = function(color){

            virtualBorderColor = color;
        };

        me.getVirtualBorderSize = function() {
            return virtualBorderSize;
        };

        me.getVirtualBorderColor = function() {
            return virtualBorderColor.toHex();
        };
        me.scaleBorderSize = function (size){
            return (size*me.scale + 0.5)>>0;
        };
        me.getLine = function (){
            var size = me.scaleBorderSize(borderSize);
            if (me.Y1 == me.Y2)
                return {
                    X1: me.X1 >>0,
                    Y1: ((me.Y1 + size/2)>>0) - size/2 ,
                    X2: (me.X2 )>>0,
                    Y2: ((me.Y2 + size/2)>>0) - size/2
                };
            else
                return {
                    X1: ((me.X1 + size/2) >>0) - size/2 ,
                    Y1: me.Y1 >> 0,
                    X2: ((me.X2 + size/2) >>0) - size/2,
                    Y2: me.Y2 >> 0
                };
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
            me.context.lineWidth = me.scaleBorderSize(borderSize);
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
            borderSize = virtualBorderSize;
            me.setBordersColor(virtualBorderColor);
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
            maxBorderSize       : 8,
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
            me.sizeCorner           = me.options.sizeConer;
            me.scale                = Common.Utils.applicationPixelRatio();
            me.backgroundColor      = 'transparent';

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
                        me.setBorderParams('t');
                        redraw = true;
                        me.fireEvent('borderclick', me, 't',  borderSize.top, borderColor.top.toHex());
                    } else if (me.inRect('b', mouseX, mouseY)) {
                        me.setBorderParams('b');
                        redraw = true;
                        me.fireEvent('borderclick', me, 'b',  borderSize.bottom, borderColor.bottom.toHex());
                    } else if (me.inRect('l', mouseX, mouseY)) {
                        me.setBorderParams('l');
                        redraw = true;
                        me.fireEvent('borderclick', me, 'l',  borderSize.left, borderColor.left.toHex());
                    } else if (me.inRect('r', mouseX, mouseY)) {
                        me.setBorderParams('r');
                        redraw = true;
                        me.fireEvent('borderclick', me, 'r',  borderSize.right, borderColor.right.toHex());
                    } else {
                        for (var i = 0; i < me._borders.length; i++) {
                            if (me._borders[i].inRect(mouseX, mouseY)) {
                                me._borders[i].setBorderParams();
                                redraw = true;
                                me.fireEvent('borderclick:cellborder', me, me._borders[i],  me._borders[i].getBorderSize(), me._borders[i].getBorderColor());
                                redraw = true;
                            }
                        }
                    }
                    (redraw) && me.redrawTable();
                });


                $(window).resize(me.resizeTable);
            });

            me.resizeTable =function (){

                me.context.clearRect(0,0, me.width*me.scale, me.height*me.scale);

                me.scale = Common.Utils.applicationPixelRatio();
                me._borders.forEach(function(b,index){
                    b.scale = me.scale;
                });

                var sizeCorner = me.sizeCorner * me.scale;
                var ctxWidth = me.width*me.scale,
                    ctxHeight = me.height*me.scale,
                    stepX = (ctxWidth - 2 * sizeCorner)/me.columns,
                    stepY = (ctxHeight - 2 * sizeCorner)/me.rows;
                var i = 0;
                for (var row = 0; row < me.rows - 1; row++) {

                    me._borders[i].Y1 = (row + 1) * stepY + sizeCorner;
                    me._borders[i].Y2 = me._borders[i].Y1;
                    me._borders[i].X1 = sizeCorner;
                    me._borders[i].X2 = ctxWidth - sizeCorner;
                    i++
                }

                for (var col = 0; col < me.columns - 1; col++) {
                    me._borders[i].Y1 = sizeCorner;
                    me._borders[i].Y2 = ctxHeight - sizeCorner;
                    me._borders[i].X1 = (col + 1) * stepX + sizeCorner;
                    me._borders[i].X2 = me._borders[i].X1;
                    i++
                }

                me.canv.width = me.width*me.scale;
                me.canv.height = me.height*me.scale;
                me.drawTable();
            };

            me.getVirtualBorderSize = function(){
                return virtualBorderSize;
            };

            me.getVirtualBorderColor = function(){
                return virtualBorderColor.toHex();
            };

            me.setVirtualBorderSize = function(size){
                virtualBorderSize = (size > me.maxBorderSize) ? me.maxBorderSize : size;

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
            me.scaleBorderSize = function (size){
                return (size*me.scale +0.5)>>0;
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

            me.getLine =function  (size, border ){
                var sizeCornerScale = me.sizeCorner * me.scale ;
                var borderWidth = me.scaleBorderSize(size);
                var linePoints={},
                    canvWidth = me.width * me.scale,
                    canvHeight =me.height * me.scale;
                switch (border){
                    case 't':
                        linePoints.X1 = sizeCornerScale >>0;
                        linePoints.Y1 = (sizeCornerScale>>0) + borderWidth / 2;
                        linePoints.X2 = (canvWidth - sizeCornerScale)>>0;
                        linePoints.Y2 = linePoints.Y1;
                        break;
                    case 'b':
                        linePoints.X1 = sizeCornerScale>>0;
                        linePoints.Y1 = ((canvHeight - sizeCornerScale)>>0) - borderWidth / 2;
                        linePoints.X2 = (canvWidth - sizeCornerScale)>>0;
                        linePoints.Y2 = linePoints.Y1;
                        break;
                    case 'l':
                        linePoints.X1 = (sizeCornerScale>>0) + borderWidth / 2;
                        linePoints.Y1 = sizeCornerScale>>0;
                        linePoints.X2 = linePoints.X1;
                        linePoints.Y2 = (canvHeight - sizeCornerScale)>>0;
                        break;
                    case 'r':
                        linePoints.X1 = ((canvWidth - sizeCornerScale)>>0) - borderWidth / 2;
                        linePoints.Y1 = sizeCornerScale>>0;
                        linePoints.X2 = linePoints.X1;
                        linePoints.Y2 = (canvHeight - sizeCornerScale)>>0;
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
            var sizeCorner = me.sizeCorner * me.scale
            sizeCorner += (me.spacingMode) ? me.cellPadding : 0;
            if (!me.rendered) {
                this._borders = [];
                var ctxWidth = me.width*me.scale,
                    ctxHeight = me.height*me.scale,
                    stepX = (ctxWidth - 2 * sizeCorner)/me.columns,
                    stepY = (ctxHeight - 2 * sizeCorner)/me.rows,
                    opt,cellBorder;

                var generalOpt = {
                    scale   : me.scale,
                    context : me.context
                };
                /*me.createHorizontlBorders(generalOpt, sizeCorner);
                me.createVerticaLBorders(generalOpt, sizeCorner);*/
                //horizontal
               /*for (var row = 0; row < me.rows - 1; row++) {
                    opt = generalOpt;
                    opt.y1 = (row + 1) * stepY + sizeCorner;
                    opt.y2 = opt.y1;
                    opt.x1 = sizeCorner;
                    opt.x2 = ctxWidth - sizeCorner;
                    opt.row = row;
                    opt.col = -1;
                    cellBorder = new Common.UI.CellBorder(opt);
                    this._borders.push(cellBorder);
                }*/
                me.createHorizontlBorders(generalOpt, sizeCorner);
                me.createVerticaLBorders(generalOpt, sizeCorner);
                //vertical
                /*for (var col = 0; col < me.columns - 1; col++) {
                    opt = generalOpt;
                    opt.y1 = sizeCorner;
                    opt.y2 = ctxHeight - sizeCorner;
                    opt.x1 = (col + 1) * stepX + sizeCorner;
                    opt.x2 = opt.x1;
                    opt.row = -1;
                    opt.col = col;
                    cellBorder = new Common.UI.CellBorder(opt);
                    this._borders.push(cellBorder);
                }*/
                this.drawTable();
            }

            me.rendered = true;

            this.trigger('render:after', this);

            return this;
        },

        createHorizontlBorders: function (generalOpt, sizeCorner){
            var me = this;
            var opt = generalOpt;
            var ctxWidth = me.width*me.scale,
                stepY = (me.height*me.scale - 2 * sizeCorner)/me.rows;
            if(!me.spacingMode) {
                for (var row = 0; row < me.rows - 1; row++) {
                    opt.y1 = (row + 1) * stepY + sizeCorner;
                    opt.y2 = opt.y1;
                    opt.x1 = sizeCorner;
                    opt.x2 = ctxWidth - sizeCorner;
                    opt.row = row;
                    opt.col = -1;
                    this._borders.push(new Common.UI.CellBorder(opt));
                }
            } else {
                var y;

                for (var row = 0; row < me.rows - 1; row++) {
                    for (var n = 0; n < 2; n++) {

                        if (n == 0) {
                            y = (row) * (stepY + me.cellPadding / 2) + sizeCorner;
                        } else {
                            y = me.height*me.scale - sizeCorner - (me.rows - row - 1) * (stepY + me.cellPadding / 2);
                        }

                        opt.y1 = (row + 1) * stepY + sizeCorner;
                        opt.y2 = opt.y1;
                        opt.x1 = sizeCorner;
                        opt.x2 = ctxWidth - sizeCorner;
                        opt.row = row;
                        opt.col = -1;
                        this._borders.push(new Common.UI.CellBorder(opt));
                    }
                }

            }
        },

        createVerticaLBorders: function (generalOpt, sizeCorner){
            var me = this;
            var opt = generalOpt;
            var ctxHeight = me.height*me.scale,
                stepX = (me.width * me.scale - 2 * sizeCorner)/me.columns;
            if(!me.spacingMode) {
                for (var col = 0; col < me.columns - 1; col++) {
                    opt.y1 = sizeCorner;
                    opt.y2 = ctxHeight - sizeCorner;
                    opt.x1 = (col + 1) * stepX + sizeCorner;
                    opt.x2 = opt.x1;
                    opt.row = -1;
                    opt.col = col;
                    this._borders.push(new Common.UI.CellBorder(opt));
                }
            } else {
                var x;
                for (var col = 0; col < me.columns - 1; col++) {
                    for (var n = 0; n < 2; n++) {

                        if (n == 0) {
                            x = (col) * (stepX + me.cellPadding / 2) + sizeCorner;
                        } else {
                            x = me.width*me.scale - sizeCorner - (me.columns - col - 1) * (stepX + me.cellPadding / 2);
                        }

                        opt.y1 = sizeCorner;
                        opt.y2 = ctxHeight - sizeCorner;
                        opt.x1 = x;
                        opt.x2 = opt.x1;
                        opt.col = col;
                        opt.row = -1;
                        this._borders.push(new Common.UI.CellBorder(opt));
                    }
                }
            }
        },

        drawCorners: function () {
            var me = this;
            var connerLineSize = (me.scale)>>0;
            var sizeCornerScale =me.sizeCorner*me.scale;
            var canvWidth = me.width*me.scale;
            var canvHeight = me.height*me.scale;

            me.context.lineJoin = 'meter';
            var diff = connerLineSize/2;
            //var sizeCornerScaleDiff = sizeCornerScale+connerLineSize/2;

            me.context.beginPath();
            me.context.setLineDash([connerLineSize,connerLineSize]);

            //lines for conners:
            //top-left
            me.context.moveTo (
                (sizeCornerScale>>0) - diff,
                0
            );
            me.context.lineTo (
                (sizeCornerScale>>0) - diff,
                (sizeCornerScale>>0) - diff
            );
            me.context.moveTo (
                (sizeCornerScale)>>0,
                (sizeCornerScale>>0) - diff
            );
            me.context.lineTo (
                0,
                (sizeCornerScale>>0) - diff
            );

            //-------------------------------------------------------
            //top-right
            me.context.moveTo (
                ((canvWidth - sizeCornerScale)>>0) + diff,
                0
            );
            me.context.lineTo (
                ((canvWidth - sizeCornerScale)>>0) + diff,
                sizeCornerScale >>0
            );
            me.context.moveTo (
                (canvWidth - sizeCornerScale)>>0,
                (sizeCornerScale>>0) - diff
            );
            me.context.lineTo (
                canvWidth,
                (sizeCornerScale>>0) - diff
            );

            //-------------------------------------------------------

            // bottom-right
            me.context.moveTo (
                ((canvWidth - sizeCornerScale)>>0) + diff,
                canvHeight>>0
            );
            me.context.lineTo (

                ((canvWidth - sizeCornerScale)>>0) + diff,
                (canvHeight - sizeCornerScale) >> 0
            );

            me.context.moveTo (
                (canvWidth - sizeCornerScale)>>0,
                ((canvHeight - sizeCornerScale)>>0) + diff);

            me.context.lineTo (
                canvWidth>>0,
                ((canvHeight - sizeCornerScale)>>0) + diff
            );

            //-------------------------------------------------------

            //bottom-left
            me.context.moveTo(
                (sizeCornerScale>>0) - diff,
                canvHeight>>0
            );
            me.context.lineTo(
                (sizeCornerScale>>0) - diff,
                (canvHeight - sizeCornerScale)>>0
            );

            me.context.moveTo(
                (sizeCornerScale)>>0,
                ((canvHeight - sizeCornerScale)>>0) + diff
            );

            me.context.lineTo(
                0,
                ((canvHeight - sizeCornerScale)>>0) + diff
            );
            //-------------------------------------------------------

            me.context.lineWidth = connerLineSize;
            me.context.strokeStyle = "grey";
            me.context.stroke();
            me.context.setLineDash([]);
        },

        inRect: function(border,MX, MY) {
            var h = 5;
            var sizeBorder = this.getBorderSize(border);
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
            me.context.lineWidth = me.scaleBorderSize(size);
            var points = me.getLine(size, border);
            me.context.beginPath();
            me.context.strokeStyle = me.getBorderColor(border);
            me.context.moveTo(points.X1, points.Y1);
            me.context.lineTo(points.X2, points.Y2);
            me.context.stroke();

        },

        drawTable: function (){
            this.drawCorners();

            var me = this;

            var diff = 0;
            var sizeCornerScale = me.sizeCorner * me.scale + diff;
            var tableWidth = me.width * me.scale - 2*sizeCornerScale,
                tableHeight = me.height * me.scale - 2*sizeCornerScale;

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
            me.fillWithLines();
            me.context.lineWidth = 0;

            me._borders.forEach(function (item){item.drawBorder();});
        },

        getBorder: function(row, col, numInCell){
            numInCell = (numInCell == undefined) ? -1 : numInCell;
            if(col<0)
                return _.findWhere(this._borders, {row: row, numInCell: numInCell});
            else {
                var n = _.findWhere(this._borders, {col: col, numInCell: numInCell});
                return _.findWhere(this._borders, {col: col, numInCell: numInCell});
            }
        },

        fillWithLines: function (){
            var me = this;
            var tdPadding = 10,
                tdWidth = (me.width - 2 * me.sizeCorner)/me.columns,
                tdHeight = (me.height - 2 * me.sizeCorner)/me.rows,
                tdX, tdY = me.sizeCorner, xLeft = me.sizeCorner;

            var x1,w,y1,h;

            me.context.beginPath();

            for (var row = 0; row < me.rows; row++) {

                tdX = xLeft;
                for (var col = 0; col < me.columns; col++) {

                    x1 = ((tdX + tdPadding) * me.scale)>>0;
                    y1 = (tdY + tdPadding) * me.scale;
                    w = ((tdWidth - 2 * tdPadding) * me.scale + 0.5)>>0 ;
                    h = (tdHeight - 2 * tdPadding) * me.scale;

                    me.context.setLineDash([(2 * me.scale + 0.5) >> 0, (2 * me.scale + 0.5) >> 0]);
                    me.context.strokeStyle = "#c0c0c0";
                    me.context.lineWidth = w;
                    me.context.moveTo(x1 + w / 2, y1 >> 0);
                    me.context.lineTo(x1 + w / 2, (y1 + h) >> 0);

                    tdX += tdWidth;
                }
                tdY += tdHeight;
            }

            me.context.stroke();
            me.context.setLineDash([])
        },

        redrawTable: function() {
            var me = this;
            me.context.clearRect(0,0, me.canv.width, me.canv.height);
            me.drawTable();
        }
    });
});
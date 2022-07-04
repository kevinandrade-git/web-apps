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

        virtualBorderSize       = me.defaultBorderSize;
        virtualBorderColor      = new Common.Utils.RGBColor(me.defaultBorderColor);
        borderSize = virtualBorderSize;
        borderColor = virtualBorderColor;
        borderAlfa = 1;

        me.setBordersSize = function (size) {
            size = (size > this.maxBorderSize) ? this.maxBorderSize : size;
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
            return {X1: me.X1, Y1: me.Y1, X2: me.X2, Y2: me.Y2};
        };

        me.inRect = function (MX, MY){
            var h = 5;
            var line =  {X1: me.X1/me.scale, Y1: me.Y1/me.scale, X2: me.X2/me.scale, Y2: me.Y2/me.scale};

            if (line.Y1 == line.Y2)
                return ((MX > line.X1 && MX < line.X2) && (MY > line.Y1 - h && MY < line.Y1 + h));
            else
                return((MY > line.Y1 && MY < line.Y2) && (MX > line.X1 - h && MX < line.X1 + h));
        };

        me.drawBorder = function (){
            if(borderSize == 0) return;
            me.context.beginPath();
            me.context.lineWidth = borderSize * me.scale;
            me.context.strokeStyle = me.getBorderColor();

            me.context.moveTo(me.X1, me.Y1);
            me.context.lineTo(me.X2, me.Y2);
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

    Common.UI.CellStyler = Common.UI.BaseView.extend({
        options : {
            clickOffset         : 10,
            overwriteStyle      : true,
            maxBorderSize       : 6,
            halfBorderSize      : false,
            defaultBorderSize   : 1,
            defaultBorderColor  : '#ccc'
        },

        template: _.template([
            '<div id="<%=id%>" class="tablestyler-cell" style="">',
                '<div class="cell-content" style="">',
                    '<div class="content-text"></div>',
                '</div>',
            '</div>'
        ].join('')),

        initialize : function(options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);

            var me = this,
                divContent = undefined,
                virtualBorderSize,
                virtualBorderColor,
                borderSize = {},
                borderColor = {},
                borderAlfa = {};

            me.id                   = me.options.id || Common.UI.getId();
            me.clickOffset          = me.options.clickOffset;
            me.overwriteStyle       = me.options.overwriteStyle;
            me.maxBorderSize        = me.options.maxBorderSize;
            me.halfBorderSize       = me.options.halfBorderSize;
            me.defaultBorderSize    = me.options.defaultBorderSize;
            me.defaultBorderColor   = me.options.defaultBorderColor;
            me.col                  = me.options.col;
            me.row                  = me.options.row;

            virtualBorderSize       = me.defaultBorderSize;
            virtualBorderColor      = new Common.Utils.RGBColor(me.defaultBorderColor);

            borderSize = {
                top     : virtualBorderSize,
                right   : virtualBorderSize,
                bottom  : virtualBorderSize,
                left    : virtualBorderSize
            };

            borderColor = {
                top     : virtualBorderColor,
                right   : virtualBorderColor,
                bottom  : virtualBorderColor,
                left    : virtualBorderColor
            };

            borderAlfa = {
                top     : 1,
                right   : 1,
                bottom  : 1,
                left    : 1
            };

            me.rendered             = false;

            var applyStyle = function(){
                if (!_.isUndefined(divContent)){
                    var brd = (borderSize.left>0.1 && borderSize.left<1) ? 1 : borderSize.left;
                    var drawLeftSize = Math.abs((me.halfBorderSize) ? ((brd % 2) ? brd - 1: brd) * 0.5 : brd);

                    brd = (borderSize.right>0.1 && borderSize.right<1) ? 1 : borderSize.right;
                    var drawRightSize = Math.abs((me.halfBorderSize) ? ((brd % 2) ? brd + 1: brd) * 0.5 : brd);

                    brd = (borderSize.top>0.1 && borderSize.top<1) ? 1 : borderSize.top;
                    var drawTopSize = Math.abs((me.halfBorderSize) ? ((brd % 2) ? brd - 1: brd) * 0.5 : brd);

                    brd = (borderSize.bottom>0.1 && borderSize.bottom<1) ? 1 : borderSize.bottom;
                    var drawBottomSize = Math.abs((me.halfBorderSize) ? ((brd % 2) ? brd + 1: brd) * 0.5 : brd);

                    var value =
                        'inset ' +           ((drawLeftSize>0.1   && drawLeftSize<1)    ? 1 : drawLeftSize)   + 'px' + ' 0' + ' 0 ' + borderColor.left.toRGBA(borderAlfa.left) + ', ' +
                        'inset ' +        -1*((drawRightSize>0.1  && drawRightSize<1)   ? 1 : drawRightSize)  + 'px' + ' 0' + ' 0 ' + borderColor.right.toRGBA(borderAlfa.right) + ', ' +
                        'inset ' + '0 ' +    ((drawTopSize>0.1    && drawTopSize<1)     ? 1 : drawTopSize)    + 'px' + ' 0 '        + borderColor.top.toRGBA(borderAlfa.top) + ', ' +
                        'inset ' + '0 ' + -1*((drawBottomSize>0.1 && drawBottomSize<1)  ? 1 : drawBottomSize) + 'px' + ' 0 '        + borderColor.bottom.toRGBA(borderAlfa.bottom);

                    divContent.css('box-shadow', value);
                }
            };

            me.on('render:after', function(cmp) {
                if (this.cmpEl){
                    divContent = this.cmpEl.find('.cell-content');

                    applyStyle();
                }

                this.cmpEl.on('click', function(event){
                    var pos = {
                        x: event.pageX*Common.Utils.zoom() - me.cmpEl.offset().left,
                        y: event.pageY*Common.Utils.zoom() - me.cmpEl.offset().top
                    };

                    var ptInPoly = function(npol, xp, yp, x, y) {
                        var i, j, c = 0;
                        for (i = 0, j = npol - 1; i < npol; j = i++){
                            if ((((yp [i] <= y) && (y < yp [j])) || ((yp [j] <= y) && (y < yp [i]))) && (x < (xp [j] - xp [i]) * (y - yp [i]) / (yp [j] - yp [i]) + xp [i]))
                                c = !c;
                        }
                        return c;
                    };

                    var meWidth = me.cmpEl.outerWidth();
                    var meHeight = me.cmpEl.outerHeight();

                    if (ptInPoly(4, [0, meWidth, meWidth-me.clickOffset, me.clickOffset], [0, 0, me.clickOffset, me.clickOffset], pos.x, pos.y)){
                        if (me.overwriteStyle){
                            if (borderSize.top != virtualBorderSize || !borderColor.top.isEqual(virtualBorderColor)){
                                borderSize.top = virtualBorderSize;
                                borderColor.top = virtualBorderColor;
                                borderAlfa.top = (virtualBorderSize<1) ? 0.3 : 1;
                            } else {
                                borderSize.top = 0;
                            }
                        } else {
                            borderSize.top = (borderSize.top > 0) ? 0 : virtualBorderSize;
                            borderColor.top = virtualBorderColor;
                        }

                        me.fireEvent('borderclick', me, 't', borderSize.top, borderColor.top.toHex());

                    } else if (ptInPoly(4, [meWidth, meWidth, meWidth-me.clickOffset, meWidth-me.clickOffset], [0, meHeight, meHeight-me.clickOffset, me.clickOffset], pos.x, pos.y)){
                        if (me.overwriteStyle){
                            if (borderSize.right != virtualBorderSize || !borderColor.right.isEqual(virtualBorderColor)){
                                borderSize.right = virtualBorderSize;
                                borderColor.right = virtualBorderColor;
                                borderAlfa.right = (virtualBorderSize<1) ? 0.3 : 1;
                            } else {
                                borderSize.right = 0;
                            }
                        } else {
                            borderSize.right = (borderSize.right > 0) ? 0 : virtualBorderSize;
                            borderColor.right = virtualBorderColor;
                        }

                        me.fireEvent('borderclick', me, 'r', borderSize.right, borderColor.right.toHex());

                    } else if (ptInPoly(4, [0, me.clickOffset, meWidth-me.clickOffset, meWidth], [meHeight, meHeight-me.clickOffset, meHeight-me.clickOffset, meHeight], pos.x, pos.y)){
                        if (me.overwriteStyle){
                            if (borderSize.bottom != virtualBorderSize || !borderColor.bottom.isEqual(virtualBorderColor)){
                                borderSize.bottom = virtualBorderSize;
                                borderColor.bottom = virtualBorderColor;
                                borderAlfa.bottom = (virtualBorderSize<1) ? 0.3 : 1;
                            } else {
                                borderSize.bottom = 0;
                            }
                        } else {
                            borderSize.bottom = (borderSize.bottom > 0) ? 0 : virtualBorderSize;
                            borderColor.bottom = virtualBorderColor;
                        }

                        me.fireEvent('borderclick', me, 'b', borderSize.bottom, borderColor.bottom.toHex());

                    } else if (ptInPoly(4, [0, me.clickOffset, me.clickOffset, 0], [0, me.clickOffset, meHeight-me.clickOffset, meHeight], pos.x, pos.y)){
                        if (me.overwriteStyle){
                            if (borderSize.left != virtualBorderSize || !borderColor.left.isEqual(virtualBorderColor)){
                                borderSize.left = virtualBorderSize;
                                borderColor.left = virtualBorderColor;
                                borderAlfa.left = (virtualBorderSize<1) ? 0.3 : 1;
                            } else {
                                borderSize.left = 0;
                            }
                        } else {
                            borderSize.left = (borderSize.left > 0) ? 0 : virtualBorderSize;
                            borderColor.left = virtualBorderColor;
                        }

                        me.fireEvent('borderclick', me, 'l', borderSize.left, borderColor.left.toHex());
                    }

                    applyStyle();
                });
            });

            me.setBordersSize = function(borders, size) {
                size = (size > this.maxBorderSize) ? this.maxBorderSize : size;

                if (borders.indexOf('t') > -1) {
                    borderSize.top = size;
                    borderAlfa.top = (size<1) ? 0.3 : 1;
                }
                if (borders.indexOf('r') > -1) {
                    borderSize.right = size;
                    borderAlfa.right = (size<1) ? 0.3 : 1;
                }
                if (borders.indexOf('b') > -1) {
                    borderSize.bottom = size;
                    borderAlfa.bottom = (size<1) ? 0.3 : 1;
                }
                if (borders.indexOf('l') > -1) {
                    borderSize.left = size;
                    borderAlfa.left = (size<1) ? 0.3 : 1;
                }

                applyStyle();
            };

            me.setBordersColor = function(borders, color) {
                var newColor = new Common.Utils.RGBColor(color);

                if (borders.indexOf('t') > -1)
                    borderColor.top = newColor;
                if (borders.indexOf('r') > -1)
                    borderColor.right = newColor;
                if (borders.indexOf('b') > -1)
                    borderColor.bottom = newColor;
                if (borders.indexOf('l') > -1)
                    borderColor.left = newColor;

                applyStyle();
            };

            me.getBorderSize = function(border) {
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

            me.getBorderColor = function(border) {
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

            me.setVirtualBorderSize = function(size) {
                virtualBorderSize = (size > this.maxBorderSize) ? this.maxBorderSize : size;
            };

            me.setVirtualBorderColor = function(color){
                var newColor = new Common.Utils.RGBColor(color);

                if (virtualBorderColor.isEqual(newColor))
                    return;

                virtualBorderColor = newColor;
            };

            me.getVirtualBorderSize = function() {
                return virtualBorderSize;
            };

            me.getVirtualBorderColor = function() {
                return virtualBorderColor.toHex();
            };

            if (me.options.el) {
                me.render();
            }
        },

        render : function(parentEl) {
            var me = this;

            this.trigger('render:before', this);

            if (!me.rendered) {
                this.cmpEl = $(this.template({
                    id: this.id
                }));

                if (parentEl) {
                    this.setElement(parentEl, false);
                    parentEl.html(this.cmpEl);
                } else {
                    this.$el.html(this.cmpEl);
                }
            } else {
                this.cmpEl = this.$el;
            }

            me.rendered = true;

            this.trigger('render:after', this);

            return this;
        }
    });

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

        /*template: _.template([
            '<div id="<%=scope.id%>" class="table-styler" style="position: relative; width: <%=scope.width%>px; height:<%=scope.height%>px;">',
                '<div class="ts-preview-box ts-preview-box--lt" style="left: 0; top: 0; width: <%=scope.tablePadding%>px; height: <%=scope.tablePadding%>px;"></div>',
                '<div class="ts-preview-box ts-preview-box--mt" style="left: <%=scope.tablePadding%>px; top: 0; right: <%=scope.tablePadding%>px; height: <%=scope.tablePadding%>px;">',
                    '<div id="<%=scope.id%>-table-top-border-selector" style="position: absolute; z-index: 1; height: <%=scope.tablePadding%>px; left: 0; right: 0; top:  <%=scope.tablePadding * .5%>px;">',
                        '<table width="100%" height="100%">',
                            '<tr>',
                                '<td id="<%=scope.id%>-table-top-border" style="height:50%; border-bottom: <%=borderSize.top%>px solid <%borderColor.top.toHex()%>;"></td>',
                            '</tr>',
                            '<tr>',
                                '<td></td>',
                            '</tr>',
                        '</table>',
                    '</div>',
                '</div>',
                '<div class="ts-preview-box ts-preview-box--rt" style="top: 0; right: 0; width: <%=scope.tablePadding%>px; height: <%=scope.tablePadding%>px;"></div>',

                '<div class="ts-preview-box ts-preview-box--lm" style="left: 0; top: <%=scope.tablePadding%>px; width: <%=scope.tablePadding%>px; height: <%=scope.height - 2 * scope.tablePadding%>px;">',
                    '<div id="<%=scope.id%>-table-left-border-selector" style="position: absolute; z-index: 1; left: <%=scope.tablePadding * .5%>px; top: 0; bottom: 0; width: <%=scope.tablePadding%>px;">',
                        '<table width="100%" height="100%">',
                            '<tr>',
                                '<td id="<%=scope.id%>-table-left-border" style="border-right: <%=borderSize.left%>px solid <%=borderColor.left.toHex()%>;"></td>',
                                '<td width="50%"></td>',
                            '</tr>',
                        '</table>',
                    '</div>',
                '</div>',
                '<div class="ts-preview-box ts-preview-box--mm" style="left: <%=scope.tablePadding%>px; top: <%=scope.tablePadding%>px; right: <%=scope.tablePadding%>px; bottom: <%=scope.tablePadding%>px;">',
                    '<table id="<%=scope.id%>-table-content" cols="<%=scope.columns%>" width="100%" height="100%" style="border-collapse: inherit; border-spacing: <%= scope.spacingMode ? scope.cellPadding : 0 %>px;">',
                        '<% for (var row = 0; row < scope.rows; row++) { %>',
                            '<tr>',
                                '<% for (var col = 0; col < scope.columns; col++) { %>',
                                    '<td id="<%=scope.id%>-cell-container-<%=col%>-<%=row%>" class="content-box"></td>',
                                '<% } %>',
                            '</tr>',
                        '<% } %>',
                    '</table>',
                '</div>',
                '<div class="ts-preview-box ts-preview-box--rm" style="right: 0; top: <%=scope.tablePadding%>px; width: <%=scope.tablePadding%>px; height: <%=scope.height - 2 * scope.tablePadding%>px;">',
                    '<div id="<%=scope.id%>-table-right-border-selector" style="position: absolute; z-index: 1; right: <%=scope.tablePadding * .5%>px; top: 0; bottom: 0; width: <%=scope.tablePadding%>px;">',
                        '<table width="100%" height="100%">',
                            '<tr>',
                                '<td id="<%=scope.id%>-table-right-border" style="border-right: <%=borderSize.right%>px solid <%=borderColor.right.toHex()%>;"></td>',
                                '<td width="50%"></td>',
                            '</tr>',
                        '</table>',
                    '</div>',
                '</div>',

                '<div class="ts-preview-box ts-preview-box--lb" style="left: 0; bottom: 0; width: <%=scope.tablePadding%>px; height: <%=scope.tablePadding%>px;"></div>',
                '<div class="ts-preview-box ts-preview-box--mb" style="left: <%=scope.tablePadding%>px; bottom: 0; right: <%=scope.tablePadding%>px; height: <%=scope.tablePadding%>px;">',
                    '<div id="<%=scope.id%>-table-bottom-border-selector" style="position: absolute; z-index: 1; height: <%=scope.tablePadding%>px; left: 0; right: 0; bottom:  <%=scope.tablePadding * .5%>px;">',
                        '<table width="100%" height="100%">',
                            '<tr>',
                                '<td id="<%=scope.id%>-table-bottom-border" style="height:50%; border-bottom: <%=borderSize.bottom%>px solid <%=borderColor.bottom.toHex()%>;"></td>',
                            '</tr>',
                            '<tr>',
                                '<td></td>',
                            '</tr>',
                        '</table>',
                    '</div>',
                '</div>',
                '<div class="ts-preview-box ts-preview-box--rb" style="bottom: 0; right: 0; width: <%=scope.tablePadding%>px; height: <%=scope.tablePadding%>px;"></div>',
            '</div>'
        ].join('')),*/

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
            me.scale                = me.options.scale;
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

            var applyStyles = function(){

            };



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

                //applyStyles();
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
                    indent = sizeCornerScale + borderWidth/2,
                    canvWidth = me.width * me.scale,
                    canvHeight =me.height * me.scale;
                var diff = me.scale;
                switch (border){
                    case 't':
                        linePoints.X1 = sizeCornerScale + diff;
                        linePoints.Y1 = indent + diff;
                        linePoints.X2 = canvWidth - sizeCornerScale - diff;
                        linePoints.Y2 = linePoints.Y1;
                        break;
                    case 'b':
                        linePoints.X1 = sizeCornerScale + diff;
                        linePoints.Y1 = canvHeight - indent - diff;
                        linePoints.X2 = canvWidth - sizeCornerScale - diff;
                        linePoints.Y2 = linePoints.Y1;
                        break;
                    case 'l':
                        linePoints.X1 = indent + diff;
                        linePoints.Y1 = sizeCornerScale+diff;
                        linePoints.X2 = linePoints.X1;
                        linePoints.Y2 = canvHeight - sizeCornerScale - diff;
                        break;
                    case 'r':
                        linePoints.X1 = canvWidth - indent - diff;
                        linePoints.Y1 = sizeCornerScale + diff;
                        linePoints.X2 = linePoints.X1;
                        linePoints.Y2 = canvHeight - sizeCornerScale - diff;
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


            if (!me.rendered) {
                var el = this.cmpEl;

                this._borders = [];
                var  cellBorder, opt, diff = me.scale;
                var stepX = (me.canv.width- 2 * me.sizeCorner * me.scale)/me.columns,
                    stepY = (me.canv.height - 2 * me.sizeCorner * me.scale)/me.rows;
                var generalOpt = {
                    scale   : me.scale,
                    context : me.canv.getContext('2d')
                };
                for (var row = 0; row < me.rows - 1; row++) {
                    opt = generalOpt;
                    opt.y1 = (row + 1) * stepY + me.sizeCorner  * me.scale+diff/2;
                    opt.y2 = opt.y1;
                    opt.x1 = me.sizeCorner  * me.scale + diff;
                    opt.x2 = me.canv.width - me.sizeCorner  * me.scale - diff;
                    opt.row = row;
                    cellBorder = new Common.UI.CellBorder(opt);
                    this._borders.push(cellBorder);
                }

                for (var col = 0; col < me.columns - 1; col++) {
                    opt = generalOpt;
                    opt.y1 = me.sizeCorner  * me.scale + diff;
                    opt.y2 = me.canv.height - me.sizeCorner  * me.scale - diff;
                    opt.x1 = (col + 1) * stepX + me.sizeCorner  * me.scale +diff/2;
                    opt.x2 = opt.x1;
                    opt.col = col;
                    cellBorder = new Common.UI.CellBorder(opt);
                    this._borders.push(cellBorder);
                }
                this.drawCorners();
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

            var context = me.canv.getContext('2d');
            context.lineJoin = 'meter';

            var diff = me.scale/2;

            context.beginPath();
            context.setLineDash([me.scale,me.scale]);

            context.moveTo(sizeCornerScale + diff, 0);
            context.lineTo(sizeCornerScale + diff, sizeCornerScale + me.scale);

            context.moveTo(0, sizeCornerScale + diff);
            context.lineTo(sizeCornerScale + me.scale/2, sizeCornerScale + diff);


            context.moveTo(canvWidth - sizeCornerScale - diff, 0);
            context.lineTo(canvWidth - sizeCornerScale - diff, sizeCornerScale + me.scale/2);

            context.moveTo(canvWidth, sizeCornerScale + diff);
            context.lineTo(canvWidth - sizeCornerScale - me.scale/2, sizeCornerScale + diff);


            context.moveTo(canvWidth - sizeCornerScale - diff, canvHeight);
            context.lineTo(canvWidth - sizeCornerScale - diff, canvHeight - sizeCornerScale - me.scale/2);

            context.moveTo(canvWidth, canvHeight - sizeCornerScale - diff);
            context.lineTo(canvWidth - sizeCornerScale - me.scale/2, canvHeight - sizeCornerScale - diff);


            context.moveTo(sizeCornerScale + diff, canvHeight);
            context.lineTo(sizeCornerScale + diff, canvHeight - sizeCornerScale - me.scale/2);

            context.moveTo(0, canvHeight - sizeCornerScale - diff);
            context.lineTo(sizeCornerScale + me.scale/2, canvHeight - sizeCornerScale - diff);


            context.lineWidth = me.scale;
            context.strokeStyle = "grey";
            context.stroke();
            context.setLineDash([]);
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
            var context = me.canv.getContext('2d');
            context.lineWidth = size * me.scale;
            var points = me.getLine(context.lineWidth, border);
            context.beginPath();
            context.strokeStyle = me.getBorderColor(border);
            context.moveTo(points.X1, points.Y1);
            context.lineTo(points.X2, points.Y2);
            context.stroke();

        },

        drawTable: function (){
            var me = this, diff = me.scale/2;
            var sizeCornerScale = me.sizeCorner * me.scale + diff, tdPadding = 6 * me.scale;
            var tableWidth = me.width * me.scale - 2*sizeCornerScale,
                tdWidth = tableWidth/me.columns,
                tableHeight = me.height * me.scale - 2*sizeCornerScale, tdHeight = tableHeight/me.rows,
                context = me.canv.getContext('2d');

            if(me.backgroundColor != 'transparent' ){
                context.beginPath();
                context.fillStyle = me.backgroundColor;
                context.fillRect(sizeCornerScale + diff, sizeCornerScale + diff, tableWidth - 2 * diff, tableHeight - 2 * diff);
                context.stroke();
            }

            context.setLineDash([]);
            me.drawBorder('t');
            me.drawBorder('b');
            me.drawBorder('l');
            me.drawBorder('r');
            context.lineWidth = 0;



            context.beginPath();
            var img = new Image() ;

            img.onload = function (){
                var tdX, tdY, pattern, widthRightBorder = 0, widthBottomBorder = 0, widthLeftBorder,
                    yTop = sizeCornerScale, xLeft = sizeCornerScale,
                    widthTopBorder = me.getBorderSize('t') * me.scale;
                pattern = context.createPattern(img, "repeat");
                context.fillStyle = pattern;
                tdY = yTop;
                for (var row = 0; row < me.rows; row++) {
                    widthLeftBorder = me.getBorderSize('l') * me.scale;
                    widthBottomBorder = (row < me.rows-1) ? me.getBorder(row,-1).getBorderSize() * me.scale  / 2 : me.getBorderSize('b') * me.scale;
                    tdX = xLeft;
                    for (var col = 0; col < me.columns; col++) {
                        widthRightBorder = (col < me.columns-1) ? me.getBorder(-1, col).getBorderSize() * me.scale  / 2 : me.getBorderSize('r') * me.scale;
                        context.fillRect(tdX + tdPadding + widthLeftBorder, tdY + tdPadding + widthTopBorder, tdWidth - (2 * tdPadding + widthLeftBorder + widthRightBorder),tdHeight - (2 * tdPadding + widthTopBorder + widthBottomBorder));
                        tdX += tdWidth;
                        widthLeftBorder = widthRightBorder;
                    }
                    tdY += tdHeight ;
                    widthTopBorder  = widthBottomBorder;
                }
            };
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAIAQMAAADk/cxGAAAABlBMVEVMaXHAwMBbbSKjAAAAAXRSTlMAQObYZgAAAA5JREFUeNpj+MAAgVAAAC0QA8HkpvUHAAAAAElFTkSuQmCC'; // full uri here
            context.stroke();

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
            context.clearRect(me.sizeCorner * me.scale + diff, me.sizeCorner * me.scale + diff, (me.width - 2*me.sizeCorner)*me.scale - 2*diff, (me.height - 2*me.sizeCorner)*me.scale - 2*diff);
            me.drawTable();
        }
    });
});
"use strict";

/* global window: true */
/* global location */
/* global $: true */
/* global Handlebars: true */
/* global expose */
/* global Loop */
/* global AST */
/* global scan */
/* global Flush */

(function(factory) {

    expose(factory, function() {
        // Browser globals
        window.Hyde = factory()
    })

}(function() {

    return {
        version: '0.1.0',

        /*
            Hyde.bind(data, tpl, callback)
        */
        bind: function bind(data, tpl, callback) {
            var clone = Loop.watch(data, function(changes) {
                // console.log(JSON.stringify(changes, null, 2))
                $.each(changes, function(_, change) {
                    var event = {
                        target: []
                    }
                    Flush.handle(event, change, clone)
                    if (location.href.indexOf('scrollIntoView') > -1) Flush.scrollIntoView(event, data)
                    Flush.highlight(event, data)
                })
            })

            // 定义数据
            // var clone = Loop.clone(data, true)

            // 修改 AST，插入 Block 占位符
            var ast = Handlebars.parse(tpl)
            AST.handle(ast, undefined, undefined, clone.$blocks = {}, clone.$helpers = {})

            // 渲染 HTML
            var compiled = Handlebars.compile(ast)
            var html = compiled(clone)

            // 扫描占位符，定位 Expression 和 Block
            var content = $('<div>' + html + '</div>')
            if (content.length) scan(content[0], data)
            content = content.contents()

            /*
                返回什么呢
                如果传入了 callback()，则返回 data，因为 callback() 的作用在于处理 content；
                如果 callback() 有返回值，则作为 bind() 的返回值返回，即优先返回 callback() 的返回值；
                如果未传入 callback，则返回 content，因为不返回 content 的话，content 就会被丢弃。

            */
            if (callback) return callback.call(data, content) || data
            return content
        },
        unbind: function unbind(data) {
            // TODO
            return
        }
    }

}));
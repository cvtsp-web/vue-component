<template>
     <ul ref="wrapper"></ul>
</template>

<script>
export default {
    name: 'CvFlyweight',
    props: {
        // 最大存在的dom数量
        max: {
            type: Number,
            default: 50
        },
        // 目标元素
        target: {
            type: String,
            default: 'span'
        }
    },
    data() {
        return {
            toolPool: 0
        }
    },
    computed: {
        _wrapper() {
            return this.$refs['wrapper'];
        }
    },
    methods: {
        /**
         * 简单的创造文本内容
         * @param {String|Html} content 
         */
        createContent(content) {
            if(this.toolPool < this.max) {
                // 没有超出最大值，继续创造dom节点
                this._wrapper.appendChild(this.createEl('li', { innerHTML: content }));
                this.toolPool++;
            }else {
                // 超出最大值， 操作存在的节点位置
                var first = this._wrapper.children[0];
                first.innerHTML = content;
                this._wrapper.appendChild(first);
            };
        },
        
        /**
         * 创造dom节点插入目标节点下
         * @param {String} tagName='div' 
         * @param {Object} properties={} 
         * @return {Element} target
         */
        createEl(tagName, properties) {
            var target = document.createElement(tagName);

            Object.getOwnPropertyNames(properties).forEach(property => {
                var value = properties[property];

                target[property] = value;
            });

            return target;
        }
    }
}
</script>




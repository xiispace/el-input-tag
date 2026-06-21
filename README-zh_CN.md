# El Input Tag

Vue 2 和 Element UI 的标签输入组件。

> 本包定位于 Vue 2 + Element UI。由于 Element Plus 已经提供了自己的 Input Tag 组件，本项目不计划提供 Vue 3 / Element Plus 版本。

<p align="center">
  <img src="demo.gif" alt="El Input Tag 示例"/>
</p>

[README in English](README.md)

## 安装

```sh
npm i el-input-tag --save
```

## 使用

全局注册：

```js
import Vue from 'vue'
import ElementUI from 'element-ui'
import ElInputTag from 'el-input-tag'

Vue.use(ElementUI)
Vue.use(ElInputTag)
```

局部注册：

```js
import { ElInputTag } from 'el-input-tag'

export default {
  components: { ElInputTag }
}
```

配合 `v-model` 使用：

```html
<el-form :model="form" ref="form">
  <el-form-item>
    <el-input-tag v-model="form.tags" placeholder="添加标签" />
  </el-form-item>
</el-form>
```

```js
export default {
  data () {
    return {
      form: {
        tags: []
      }
    }
  }
}
```

## 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ------ | ------ |
| value / v-model | 标签数组 | array | | `[]` |
| size | 输入框尺寸 | string | mini / small / medium | |
| read-only | 是否只读 | boolean | | `false` |
| placeholder | 输入框占位文本 | string | | |
| add-tag-on-keys | 触发新增标签的 keyCode 数组 | array | | `[13, 188, 9]` |
| transform-tag | 保存前转换标签值的函数 | function | | `tag => tag` |
| validate-tag | 保存前校验标签值的函数 | function | | `() => true` |

`type`、`hit`、`color`、`effect` 等 Element UI Tag 属性会透传给内部的 `el-tag`。

## 事件

| 事件名 | 说明 | 参数 |
| ------ | ---- | ---- |
| input | 用于 `v-model` 更新 | `tags` |
| invalid | `validate-tag` 拒绝标签，或 `transform-tag` 返回 `null` / `undefined` 时触发 | `tag` |

## 示例

### 自定义触发按键

默认按 Enter、英文逗号和 Tab 会新增当前标签，可以通过 `add-tag-on-keys` 自定义：

```html
<el-input-tag v-model="tags" :add-tag-on-keys="[13]" />
```

### 数字数组

如果希望输入 `1,2,3` 后得到 `[1, 2, 3]`，可以配合 `validate-tag` 和 `transform-tag`：

```html
<el-input-tag
  v-model="ids"
  :validate-tag="tag => /^\d+$/.test(tag)"
  :transform-tag="tag => Number(tag)"
/>
```

## 注意

本组件基于 Element UI 的 `el-tag` 封装，请先安装并注册 Element UI。

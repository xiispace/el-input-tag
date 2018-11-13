# El Input Tag
Element UI 标签输入组件。
<p align="center">
  <img src="demo.gif" alt="Logo"/>
</p>

[README in English](README.md)

## 使用
`npm/cnpm i el-input-tag --save`
- 全局注册
``` js
import ElInputTag from 'el-input-tag'
Vue.use(ElInputTag)
```

- 直接使用
``` js
import {ElInputTag} from 'el-input-tag'

export default {
    components: {ElInputTag}
}
```

## 示例
``` html
<div>
    <el-form :model="form" ref="form">
      <el-form-item>
        <el-input-tag v-model="form.tags"></el-input-tag>
      </el-form-item>
    </el-form>
</div>
```
# El Input Tag
a input tag editor component of Element UI
<p align="center">
  <img src="demo.gif" alt="Logo"/>
</p>

[中文 README](README-zh_CN.md)

## Usage
`npm/cnpm i el-input-tag --save`
- global
``` js
import ElInputTag from 'el-input-tag'
Vue.use(ElInputTag)
```


- component
``` js
import {ElInputTag} from 'el-input-tag'

export default {
    components: {ElInputTag}
}
```

## Sample
``` html
<div>
    <el-form :model="form" ref="form">
      <el-form-item>
        <el-input-tag v-model="form.tags"></el-input-tag>
      </el-form-item>
    </el-form>
</div>
```
```
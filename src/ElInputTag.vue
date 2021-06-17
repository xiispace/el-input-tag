<template>
  <div
    class="el-input-tag input-tag-wrapper"
    :class="[size ? 'el-input-tag--' + size : '']"
    @click="focusTagInput">
    <el-tag
      v-for="(tag, idx) in innerTags"
      v-bind="$attrs"
      :key="tag"
      :size="size"
      :closable="!readOnly"
      :disable-transitions="false"
      @close="remove(idx)">
      {{tag}}
    </el-tag>
    <input
      v-if="!readOnly"
      class="tag-input"
      v-model="newTag"
      @keydown.delete.stop = "removeLastTag"
      @keydown = "addNew"
      @blur = "addNew"/>
  </div>
</template>

<script>
export default {
  name: 'ElInputTag',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    addTagOnKeys: {
      type: Array,
      default: () => [13, 188, 9]
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    size: String
  },
  data () {
    return {
      newTag: '',
      innerTags: [...this.value]
    }
  },
  watch: {
    value () {
      this.innerTags = [...this.value]
    }
  },
  methods: {
    focusTagInput () {
      if (this.readOnly || !this.$el.querySelector('.tag-input')) {

      } else {
        this.$el.querySelector('.tag-input').focus()
      }
    },
    addNew (e) {
      if (e && (!this.addTagOnKeys.includes(e.keyCode)) && (e.type !== 'blur')) {
        return
      }
      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }
      let addSuccess = false
      if (this.newTag.includes(',')) {
        this.newTag.split(',').forEach(item => {
          if (this.addTag(item.trim())) {
            addSuccess = true
          }
        })
      } else {
        if (this.addTag(this.newTag.trim())) {
          addSuccess = true
        }
      }
      if (addSuccess) {
        this.tagChange()
        this.newTag = ''
      }
    },
    addTag (tag) {
      tag = tag.trim()
      if (tag && !this.innerTags.includes(tag)) {
        this.innerTags.push(tag)
        return true
      }
      return false
    },
    remove (index) {
      this.innerTags.splice(index, 1)
      this.tagChange()
    },
    removeLastTag () {
      if (this.newTag) {
        return
      }
      this.innerTags.pop()
      this.tagChange()
    },
    tagChange () {
      this.$emit('input', this.innerTags)
    }
  }
}
</script>

<style scoped>
  .input-tag-wrapper {
    position: relative;
    font-size: 14px;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    outline: none;
    padding: 0 10px 0 5px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }
  .el-tag {
    margin-right: 4px;
  }

  .tag-input {
    background: transparent;
    border: 0;
    font-size: inherit;
    outline: none;
    padding-left: 0;
    width: 100px;
  }
  .el-input-tag {
    min-height: 42px;
  }
  .el-input-tag--mini {
    min-height: 28px;
    line-height: 28px;
    font-size: 12px;
  }

  .el-input-tag--small {
    min-height: 32px;
    line-height: 32px;
  }

  .el-input-tag--medium {
    min-height: 36px;
    line-height: 36px;
  }

</style>

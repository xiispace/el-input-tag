<template>
  <div
    class="el-input-tag input-tag-wrapper"
    :class="[
      size ? 'el-input-tag--' + size : '',
      isReadOnly ? 'is-readonly' : '',
      disabled ? 'is-disabled' : '',
      isFocused ? 'is-focus' : ''
    ]"
    @click="focusTagInput">
    <el-tag
      v-for="(tag, idx) in innerTags"
      v-bind="$attrs"
      :key="idx + '-' + tag"
      :size="size"
      :closable="!isReadOnly && !disabled"
      :disable-transitions="false"
      @close="remove(idx)">
      {{ tag }}
    </el-tag>
    <input
      v-if="!isReadOnly"
      ref="input"
      class="tag-input"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="newTag"
      :aria-label="ariaLabel"
      @input="inputTag"
      @focus="isFocused = true"
      @blur="addNew"
      @compositionstart="isComposing = true"
      @compositionend="compositionEnd"
      @keydown.delete.stop="removeLastTag"
      @keydown="addNew" />
  </div>
</template>

<script>
export default {
  name: 'ElInputTag',
  inheritAttrs: false,
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
    disabled: {
      type: Boolean,
      default: false
    },
    size: String,
    placeholder: String,
    ariaLabel: {
      type: String,
      default: 'Tag input'
    },
    separator: {
      type: [String, RegExp],
      default: ','
    },
    allowDuplicate: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: 0
    },
    transformTag: {
      type: Function,
      default: tag => tag
    },
    validateTag: {
      type: Function,
      default: () => true
    }
  },
  data () {
    return {
      newTag: '',
      innerTags: [...this.value],
      isComposing: false,
      isFocused: false
    }
  },
  computed: {
    isReadOnly () {
      return this.readOnly || this.$attrs.readonly !== undefined
    },
    hasReachedMax () {
      return this.max > 0 && this.innerTags.length >= this.max
    }
  },
  watch: {
    value () {
      this.innerTags = [...this.value]
    }
  },
  methods: {
    focusTagInput () {
      if (this.isReadOnly || this.disabled || !this.$refs.input) {
        return
      }
      this.$refs.input.focus()
    },
    inputTag (ev) {
      this.newTag = ev.target.value
    },
    compositionEnd (ev) {
      this.isComposing = false
      this.inputTag(ev)
    },
    addNew (e) {
      if (this.disabled || this.isComposing) {
        return
      }
      if (e && e.type !== 'blur' && !this.addTagOnKeys.includes(e.keyCode)) {
        return
      }
      if (e && e.type === 'keydown') {
        e.stopPropagation()
        e.preventDefault()
      }
      if (e && e.type === 'blur') {
        this.isFocused = false
      }

      let addSuccess = false
      this.splitInputValue(this.newTag).forEach(item => {
        if (this.addTag(item)) {
          addSuccess = true
        }
      })

      if (addSuccess) {
        this.tagChange()
        this.newTag = ''
      }
    },
    splitInputValue (value) {
      const tag = `${value}`
      if (this.separator instanceof RegExp) {
        return tag.split(this.separator)
      }
      if (this.separator && tag.includes(this.separator)) {
        return tag.split(this.separator)
      }
      return [tag]
    },
    addTag (tag) {
      const normalizedTag = `${tag}`.trim()
      if (!normalizedTag || this.hasReachedMax) {
        return false
      }

      if (!this.validateTag(normalizedTag, this.innerTags)) {
        this.$emit('invalid', normalizedTag)
        return false
      }

      const transformedTag = this.transformTag(normalizedTag, this.innerTags)
      if (transformedTag === undefined || transformedTag === null) {
        this.$emit('invalid', normalizedTag)
        return false
      }

      if (!this.allowDuplicate && this.innerTags.includes(transformedTag)) {
        return false
      }

      this.innerTags.push(transformedTag)
      return true
    },
    remove (index) {
      if (this.isReadOnly || this.disabled) {
        return
      }
      this.innerTags.splice(index, 1)
      this.tagChange()
    },
    removeLastTag () {
      if (this.disabled || this.newTag || !this.innerTags.length) {
        return
      }
      this.innerTags.pop()
      this.tagChange()
    },
    tagChange () {
      this.$emit('input', [...this.innerTags])
      this.$emit('change', [...this.innerTags])
    }
  }
}
</script>

<style scoped>
  .el-form-item.is-error .el-input-tag {
      border-color: #f56c6c;
  }
  .input-tag-wrapper {
    position: relative;
    font-size: 14px;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    outline: none;
    padding: 4px 10px 4px 5px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }
  .input-tag-wrapper:hover {
    border-color: #c0c4cc;
  }
  .input-tag-wrapper.is-focus {
    border-color: #409eff;
  }
  .input-tag-wrapper.is-disabled {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .input-tag-wrapper.is-readonly {
    background-color: #f5f7fa;
  }
  .el-tag {
    margin-right: 0;
  }

  .tag-input {
    background: transparent;
    border: 0;
    flex: 1 0 100px;
    font-size: inherit;
    line-height: 24px;
    min-width: 80px;
    outline: none;
    padding-left: 0;
  }
  .tag-input:disabled {
    cursor: not-allowed;
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

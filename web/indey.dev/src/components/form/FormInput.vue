<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
    required: true,
  },
  value: {
    type: String,
    required: false,
  },
  isValid: {
    type: Boolean,
    default: undefined,
    required: false,
  },
  isDisabled: {
    type: Boolean,
    required: false,
  },
  isPrimary: {
    type: Boolean,
    required: false,
  },
})

const emits = defineEmits([
  'on-change'
])

function onChange(event) {
  console.log('on-change')
  emits('on-change', event)
}
</script>

<template>
  <label
    :class="{
      'input': true,
      'input--valid': isValid === true,
      'input--error': isValid === false,
    }"
  >
    <span class="input__label">{{ label }}</span>
    <input
      class="input__field"
      :type="type"
      :value="value"
      :disabled="isDisabled"
      @change="onChange"
    >
  </label>
</template>

<style>
.input {
  display: flex;
  flex-direction: column;
  gap: calc(var(--form-field-gap) / 4);
}

.input__label {
  display: block;
}

.input__field {
  appearance: none;
  color: hsl(var(--primary-color));
  background-color: transparent;
  border: 2px solid hsl(var(--primary-color));
  border-radius: var(--form-field-border-radius);
  padding: var(--form-field-vertical-padding) var(--form-field-horizontal-padding);
  font-size: var(--form-field-font-size);
  font-weight: var(--font-medium-weight);
  outline: none;
  cursor: pointer;
}

.input__field:hover {
  color: hsla(var(--primary-color)/ 70%);
  border-color: hsla(var(--primary-color) / 70%);
}

.input__field:focus-visible {
  box-shadow: 0 0 0 2px hsl(var(--text-inversion-color)), 0 0 0 4px hsl(var(--primary-color));
}

.input__field:active {
  background-color: hsla(var(--primary-color) / 5%);
}

.input__field:hover:disabled,
.input__field:active:disabled,
.input__field:disabled {
  color: hsla(var(--primary-color)/ 20%);
  background-color: transparent;
  border-color: hsla(var(--primary-color) / 20%);
  cursor: default;
}

.input--valid .input__field {
  border: 2px solid hsl(var(--valid-color));
}

.input--error .input__field {
  border: 2px solid hsl(var(--error-color));
}
</style>

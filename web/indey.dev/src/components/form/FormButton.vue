<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  label: {
    type: String,
    required: true,
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
  'on-click'
])

function onClick(event) {
  console.log('on-click')
  emits('on-click', event)
}
</script>

<template>
  <button
    :class="{
      'button': true,
      'button--primary': isPrimary,
    }"
    :disabled="isDisabled"
    @click="onClick"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.button {
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

.button:hover {
  color: hsla(var(--primary-color)/ 70%);
  border-color: hsla(var(--primary-color) / 70%);
}

.button:focus-visible {
  box-shadow: 0 0 0 2px hsl(var(--text-inversion-color)), 0 0 0 4px hsl(var(--primary-color));
}

.button:active {
  background-color: hsla(var(--primary-color) / 5%);
}

.button:hover:disabled,
.button:active:disabled,
.button:disabled {
  color: hsla(var(--primary-color)/ 20%);
  background-color: transparent;
  border-color: hsla(var(--primary-color) / 20%);
  cursor: default;
}

.button--primary {
  color: hsl(var(--text-inversion-color));
  background-color: hsl(var(--primary-color));
  border-color: transparent;
}

.button--primary:hover {
  color: hsl(var(--text-inversion-color));
  background-color: hsla(var(--primary-color) / 70%);
  border-color: transparent;
}

.button--primary:active {
  background-color: hsla(var(--primary-color) / 40%);
}

.button--primary:hover:disabled,
.button--primary:active:disabled,
.button--primary:disabled {
  color: hsl(var(--text-inversion-color));
  background-color: hsla(var(--primary-color) / 20%);
  border-color: transparent;
  cursor: default;
}
</style>

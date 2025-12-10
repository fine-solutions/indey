<script setup>
import { ref } from 'vue'
import { useProfileStore } from '@/stores/profile'
import FormButton from '../components/form/FormButton.vue'
import FormInput from '../components/form/FormInput.vue'


const mode = ref('profile')
const store = useProfileStore()
const {
  getFirstName, getSecondName, getLastName, getEmail, getPhone,
  setFirstName, setSecondName, setLastName, setEmail, setPhone,
  getRole, getOrderList
} = store

const firstName = ref(getFirstName())
const secondName = ref(getSecondName())
const lastName = ref(getLastName())
const email = ref(getEmail())
const phone = ref(getPhone())
const role = ref(getRole())
const orderList = ref(getOrderList())

const isLastNameValid = ref(undefined)
function changeLastName(event) {
  if(setLastName(event.target.value)) {
    isLastNameValid.value = true
  } else {
    isLastNameValid.value = false
  }
}

const isFirstNameValid = ref(undefined)
function changeFirstName(event) {
  if(setFirstName(event.target.value)) {
    isFirstNameValid.value = true
  } else {
    isFirstNameValid.value = false
  }
}

const isSecondNameValid = ref(undefined)
function changeSecondName(event) {
  if(setSecondName(event.target.value)) {
    isSecondNameValid.value = true
  } else {
    isSecondNameValid.value = false
  }
}

const isEmailValid = ref(undefined)
function changeEmail(event) {
  if(setEmail(event.target.value)) {
    isEmailValid.value = true
  } else {
    isEmailValid.value = false
  }
}

const isPhoneValid = ref(undefined)
function changePhone(event) {
  if(setPhone(event.target.value)) {
    isPhoneValid.value = true
  } else {
    isPhoneValid.value = false
  }
}

function changeMode(newMode) {
  mode.value = newMode
}
</script>

<template>
  <main class="profile">
    <h1 class="profile">Личный кабинет</h1>
    <section class="profile__menu">
      <button
        :class="{
          'profile__menu-button': true,
          'button': true,
          'button--active': mode === 'profile',
        }"
        @click="changeMode('profile')"
      >Профиль</button>
      <button
        :class="{
          'profile__menu-button': true,
          'button': true,
          'button--active': mode === 'orders',
        }"
        @click="changeMode('orders')"
      >Заказы</button>
      <button
        :class="{
          'profile__menu-button': true,
          'button': true,
          'button--active': mode === 'clients',
        }"
        v-if="[ 'manager' ].includes(role)"
        @click="changeMode('clients')"
      >Клиенты</button>
    </section>
    <section v-if="mode === 'orders'" class="profile__content profile__content--orders">
      <table class="profile__order-list">
        <thead>
          <tr class="profile__order-row">
            <th class="profile__order-cell">Дата</th>
            <th class="profile__order-cell">Номер</th>
            <th class="profile__order-cell">Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr class="profile__order-row" v-for="(order, oIndex) in orderList" :key="oIndex">
            <th class="profile__order-cell">{{ order.date }}</th>
            <th class="profile__order-cell">{{ order.order }}</th>
            <th class="profile__order-cell">{{ order.status }}</th>
          </tr>
        </tbody>
      </table>
    </section>
    <section v-else-if="mode === 'clients' && [ 'manager' ].includes(role)" class="profile__content profile__content--clients">

    </section>
    <section v-else-if="mode === 'profile'" class="profile__content profile__content--profile">
      <form class="profile__form form">
        <fieldset class="form__fieldset form__fieldset--vertical">
          <legend class="form__legend">
            Вы можете поменять значения настроек пользователя и нажать кнопку <kbd>Cохранить</kbd>
          </legend>
          <FormInput class="form_input" label="Фамилия" :is-valid="isLastNameValid" :value="lastName" @on-change="changeLastName" />
          <FormInput class="form_input" label="Имя" :is-valid="isFirstNameValid" :value="firstName" @on-change="changeFirstName" />
          <FormInput class="form_input" label="Отчество" :is-valid="isSecondNameValid" :value="secondName" @on-change="changeSecondName" />
          <FormInput class="form_input" label="Электронная почта" :is-valid="isEmailValid" :value="email" type="email" @on-change="changeEmail" />
          <FormInput class="form_input" label="Телефон" type="phone" :is-valid="isPhoneValid" :value="phone" @on-change="changePhone" />
        </fieldset>
      </form>
    </section>
  </main>
</template>

<style>
.profile {
  display: grid;
  gap: var(--page-gap);
  padding: 0px var(--form-field-horizontal-padding);
}

.profile__menu {
  display: flex;
  flex-direction: row;
  gap: calc(var(--form-field-gap) / 4);
  padding: 0px var(--form-field-horizontal-padding);
  border-bottom: 2px solid hsl(var(--primary-color));
}

.profile__menu-button {
  appearance: none;
  color: hsl(var(--primary-color));
  background-color: transparent;
  border: 2px solid hsl(var(--primary-color));
  border-bottom: none;
  border-radius: var(--form-field-border-radius);
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  padding: var(--form-field-vertical-padding) var(--form-field-horizontal-padding);
  font-size: var(--form-field-font-size);
  font-weight: var(--font-medium-weight);
  outline: none;
  cursor: pointer;
}

.button--active {
  color: hsl(var(--text-inversion-color));
  background-color: hsl(var(--primary-color));
  border-color: transparent;
}

.form {
  display: grid;
}

.form__fieldset {
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: start;
  border: none;
  gap: var(--form-field-gap);
  padding: var(--form-field-horizontal-padding);
}

.form__fieldset--vertical {
  flex-direction: column
}

.form__legend {
  text-align: start;
  font-family: var(--font-family);
  font-weight: var(--font-regular-weight);
  font-size: var(--form-field-font-size);
}
</style>

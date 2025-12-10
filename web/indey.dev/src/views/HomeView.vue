<script setup>
import { useRouter } from 'vue-router'
import FormButton from '../components/form/FormButton.vue'

const router = useRouter()

function goToPrices() {
  router.push({ name: 'prices' })
}

function goToRepo() {
  router.push({ name: 'repo' })
}
</script>

<template>
  <main class="home">
    <h1 class="home__header-1">Indey</h1>
    <p class="home__paragraph">
      Проект Indey — набор базовых инструментов для инди-предпринимателей, с ограниченным бюджетом для разработки и внедрения цифровых продуктов. Презентация продукта(-ов), обработка заказов и поддержка клиентов — основная цель Indey.
    </p>
    <form class="home__form form">
      <fieldset class="form__fieldset">
        <legend class="form__legend">
          Indey — система продуктов для поддержки предпринимательской деятельности, управления заказами, работы с клиентами и представления продуктов.
        </legend>
        <FormButton class="form__button" label="Попробовать" :is-primary="true" @on-click="goToPrices"/>
        <FormButton class="form__button" label="Репозиторий" @on-click="goToRepo"/>
      </fieldset>
    </form>
  </main>
</template>

<style scoped>
.home {
  display: grid;
  gap: var(--page-gap);
  padding: var(--page-padding);
}

.home__header-1 {
  font-weight: var(--font-medium-weight);
  font-size: 2em;
}

.home__paragraph {
  font-size: 1em;
}

.form {
  display: grid;
  padding: var(--form-field-horizontal-padding);
}

.form__fieldset {
  display: flex;
  flex-direction: row;
  justify-content: center;
  border: none;
  gap: var(--form-field-gap);
  padding: var(--form-field-horizontal-padding);
}

.form__legend {
  text-align: center;
  font-family: var(--font-family);
  font-weight: var(--font-regular-weight);
  font-size: var(--form-field-font-size);
}
</style>

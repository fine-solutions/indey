<script setup>
import { ref } from 'vue'
import { useRouter, RouterView } from 'vue-router'

const router = useRouter()

const currentYear = ref(0)
currentYear.value = new Date().getFullYear()

function toggleMenu() {
  const menu = document.querySelector('.app__navigation')
  menu.classList.toggle('navigation--open')
}

function goToProfile() {
  router.push({ name: 'profile' })
}
</script>

<template>
  <header class="app__header">
    <button class="app__menu" @click="toggleMenu">Меню</button>
    <button class="app__profile" @click="goToProfile">Профиль</button>
  </header>
  <RouterView class="app__main" />
  <footer class="app__footer">
    Все права защищены © {{ currentYear }}
  </footer>
  <nav class="app__navigation navigation">
    <ul class="navigation__list">
      <li class="navigation__item">
        <router-link @click="toggleMenu" :to="{ name: 'home' }">Главная страница</router-link>
      </li>
      <li class="navigation__item">
        <router-link @click="toggleMenu" :to="{ name: 'prices' }">Тарифные планы</router-link>
      </li>
      <li class="navigation__item">
        <router-link @click="toggleMenu" :to="{ name: 'profile' }">Профиль пользователя</router-link>
      </li>
      <li class="navigation__item">
        <router-link @click="toggleMenu" :to="{ name: 'repo' }">Репозиторий проекта</router-link>
      </li>
    </ul>
    <button class="navigation__close" @click="toggleMenu">Закрыть</button>
  </nav>
</template>

<style>
.app {
  font-size: var(--paragraph-font-size);
  font-family: var(--font-family);
  color: hsl(var(--text-color));
}

.app__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--page-padding);
}

.app__menu,
.app__profile {
  appearance: none;
  background-color: transparent;
  border: none;
  font-weight: var(--font-medium-weight);
  padding: var(--form-field-vertical-padding) 0px;
  cursor: pointer;
  color: hsl(var(--primary-color));
  font-weight: var(--font-medium-weight);
}

.app__footer {
  padding: var(--page-padding);
}

.app__navigation {
  position: fixed;
  display: none;
  width: 100vw;
  height: 100vh;
  left: 0px;
  top: 0px;
}

.navigation {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--page-gap);
  background-color: hsl(var(--background-color));
}

.navigation--open {
  display: flex;
}

.navigation__list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--form-field-gap);
  list-style: none;
  padding: 0px;
  margin: 0px;
}

.navigation__item a {
  cursor: pointer;
  text-decoration: none;
  color: hsl(var(--text-color));
}

.navigation__close {
  cursor: pointer;
  appearance: none;
  background-color: transparent;
  border: none;
  color: hsl(var(--primary-color));
  font-weight: var(--font-medium-weight);
}
</style>

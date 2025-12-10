import { ref } from 'vue'
import { defineStore } from 'pinia'

const orderListDbVersion = 3
const storagePrefix = 'indey-profile'
const firstNameValueKey = `${storagePrefix}-first-name`
const secondNameValueKey = `${storagePrefix}-second-name`
const lastNameValueKey = `${storagePrefix}-last-name`
const emailValueKey = `${storagePrefix}-email`
const phoneValueKey = `${storagePrefix}-phone`
const roleValueKey = `${storagePrefix}-role`
const orderListObjectStore = 'user-orders'
const orderListValueKey = `${storagePrefix}-order-list`

export const useProfileStore = defineStore('profile', () => {
  const firstName = ref('')
  const secondName = ref('')
  const lastName = ref('')
  const email = ref('')
  const phone = ref('')
  const role = ref('client')
  const orderList = ref([])

  const firstNameValue = window.localStorage.getItem(firstNameValueKey)
  if (firstNameValue) {
    firstName.value = firstNameValue
  }

  const secondNameValue = window.localStorage.getItem(secondNameValueKey)
  if (secondNameValue) {
    secondName.value = secondNameValue
  }

  const lastNameValue = window.localStorage.getItem(lastNameValueKey)
  if (lastNameValue) {
    lastName.value = lastNameValue
  }

  const emailValue = window.localStorage.getItem(emailValueKey)
  if (emailValue) {
    email.value = emailValue
  }

  const phoneValue = window.localStorage.getItem(phoneValueKey)
  if (phoneValue) {
    phone.value = phoneValue
  }

  const roleValue = window.localStorage.getItem(roleValueKey)
  if (roleValue) {
    role.value = roleValue
  }

  function checkName(newName) {
    const pattern = /^[А-ЯA-Z][а-яa-z-']+[а-яa-z]$/
    if (pattern.test(newName)) {
      return true
    } else {
      return false
    }
  }

  function getFirstName() {
    return firstName.value
  }

  function setFirstName(newName) {
    const isValid = checkName(newName)
    if (isValid) {
      firstName.value = newName
      window.localStorage.setItem(firstNameValueKey, newName)
    }
    return isValid
  }

  function getSecondName() {
    return secondName.value
  }

  function setSecondName(newName) {
    const isValid = checkName(newName)
    if (isValid) {
      secondName.value = newName
      window.localStorage.setItem(secondNameValueKey, newName)
    }
    return isValid
  }

  function getLastName() {
    return lastName.value
  }

  function setLastName(newName) {
    const isValid = checkName(newName)
    if (isValid) {
      lastName.value = newName
      window.localStorage.setItem(lastNameValueKey, newName)
    }
    return isValid
  }

  function getEmail() {
    return email.value
  }

  function setEmail(newEmail) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (pattern.test(newEmail)) {
      email.value = newEmail
      window.localStorage.setItem(emailValueKey, newEmail)
      return true
    } else {
      return false
    }
  }

  function getPhone() {
    return phone.value
  }

  function setPhone(newPhone) {
    const pattern = /^\+[1-9]\d{1,14}$/
    if (pattern.test(newPhone)) {
      phone.value = newPhone
      window.localStorage.setItem(phoneValueKey, newPhone)
      return true
    } else {
      return false
    }
  }

  function getRole() {
    return role.value
  }

  function setRole(newRole) {
    role.value = newRole
    window.localStorage.setItem(roleValueKey, newRole)
    return true
  }

  let orderListDb

  const iDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
  if (!iDB) {
    console.error('Браузер не поддерживает IndexedDB')
  } else {
    const orderListConnection = iDB.open(orderListValueKey, orderListDbVersion)
    orderListConnection.onupgradeneeded = (event) => {
      orderListDb = event.target.result
      try {
        orderListDb.deleteObjectStore(orderListObjectStore)
      } catch (error) {
        console.error(error)
      }
      orderListDb.createObjectStore(orderListObjectStore, { keyPath: `key${orderListDbVersion}`, autoIncrement: true })
    }
    orderListConnection.onsuccess = (event) => {
      orderListDb = event.target.result
      downloadOrderList(orderListDb)
    }
    orderListConnection.onerror = (event) => {
      console.error(`Ошибка: ${ event.target.error }`)
    }
  }

  function downloadOrderList(orderListDb) {
    const statusList = [ 'Принят', 'В обработке', 'Выполнен' ]
    const orderCount = 10
    const records = []
    for (let i = 0; i < orderCount; i++) {
      records.push({
        date: Date.now(),
        order: String(Math.round(Math.random() * 10000)),
        status: statusList[Math.round(Math.random() * 3)],
      })
    }

    for (let i = 0; i < orderCount; i++) {
      const transaction = orderListDb.transaction([ orderListObjectStore ], 'readwrite')
      const store = transaction.objectStore(orderListObjectStore)

      transaction.oncomplete = (event) => {
        console.log(event.target)
        console.log('Заказ добавлен в хранилище')
      }

      transaction.onerror = (event) => {
        console.error(`Ошибка: ${ event.target.error }`)
      }

      store.add(records[i])
    }
  }

  function getOrderList() {
    const orderListConnection = iDB.open(orderListValueKey, orderListDbVersion)

    orderListConnection.onsuccess = (event) => {
      orderListDb = event.target.result
      const transaction = orderListDb.transaction(orderListObjectStore)
      const store = transaction.objectStore(orderListObjectStore)
      const cursorObject = store.openCursor()

      cursorObject.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          orderList.value.push({
            date: cursor.value.date,
            order: cursor.value.order,
            status: cursor.value.status,
          })
          cursor.continue()
        } else {
          console.log('Все заказы загружены...')
        }
      }

      cursorObject.onerror = (event) => {
        console.error(`Ошибка: ${ event.target.error }`)
      }
    }
    orderListConnection.onerror = (event) => {
      console.error(`Ошибка: ${ event.target.error }`)
    }

    return orderList.value
  }

  return {
    getFirstName, setFirstName,
    getSecondName, setSecondName,
    getLastName, setLastName,
    getEmail, setEmail,
    getPhone, setPhone,
    getRole, setRole,
    getOrderList,
  }
})

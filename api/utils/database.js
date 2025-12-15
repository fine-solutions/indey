class BaseModel {
  static isFilterValid(filter) {
    let filterKeys = []
    if (typeof filter !== 'object') {
      return false
    } else {
      filterKeys = Object.keys(filter)
      if (filterKeys.length === 0) {
        return true
      }
    }
    let result = true
    for (let i = 0; i < filterKeys.length; i++) {
      const operations = Object.keys(filter[filterKeys[i]])
      if (operations.length === 0) {
        result = result && true
      } else {
        for (let j = 0; j < operations.length; j++) {
          switch (operations[j]) {
            case '<':
            case '<=':
            case '>':
            case '>=':
              if (!['number'].includes(typeof filter[filterKeys[i]][operations[j]])) {
                throw new Error(`Type of operation '${operations[j]}' value '${filter[filterKeys[i]][operations[j]]}' in filter object is not valid`)
              }
              return true
            case '=':
              if (!['number', 'string'].includes(typeof filter[filterKeys[i]][operations[j]])) {
                throw new Error(`Type of operation '${operations[j]}' value '${filter[filterKeys[i]][operations[j]]}' in filter object is not valid`)
              }
              return true
            default:
              throw new Error(`Operation '${operations[j]}' for field in filter object is not compatible`)
          }
        }
      }
    }
  }
}

/**
 * prepareWhereExpression — filter to where expression convertor
 *
 * @param   {object}  filter      An object for filtering of users
 *                                in following format:
 *                                `{ field: { operation: value } }`.
 *                                
 *                                Example:
 *                                {
 *                                  id: {
 *                                    '=': 5,
 *                                  },
 *                                }
 * @param   {number}  startIndex  start number of values
 * @return  {object}              an object for where expression
 */
function prepareWhereExpression(filter, startIndex = 1) {
  BaseModel.isFilterValid(filter=filter)
  let text = ''
  let counter = startIndex
  const values = []
  const filterKeys = Object.keys(filter)
  for (let i = 0; i < filterKeys.length; i++) {
    const field = filterKeys[i]
    const operationList = Object.keys(filter[field])
    for (let j = 0; j < operationList.length; j++) {
      const operation = operationList[j]
      text += `${counter === 1 ? '' : ' AND'} ${field} ${operation} \$${counter}`
      values.push(filter[field][operation])
      counter++
    }
  }

  return {
    text: text === '' ? '' : `WHERE ${text}`,
    values,
  }
}

module.exports = {
  BaseModel,
  prepareWhereExpression,
}

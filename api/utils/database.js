class BaseModel {
  static isFilterValid(filter) {
    if (typeof filter !== 'object') {
      return false
    } else {
      const filterKeys = Object.keys(filter)
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
          if (!this.isValueTypeValid(filterKeys[i], filter[filterKeys[i]][operations[j]])) {
            throw new Error(`Value '${filter[filterKeys[i]][operations[j]]}' for field '${filterKeys[i]}' in filter object is not valid for field type`)
          }
          switch (operations[j]) {
            case '<':
            case '<=':
            case '>':
            case '>=':
              if (!['number'].includes(typeof filter[filterKeys[i]][operations[j]])) {
                throw new Error(`Type of operation '${operations[j]}' value '${filter[filterKeys[i]][operations[j]]}' in filter object is not valid`)
              }
            case '=':
              if (!['number', 'string'].includes(typeof filter[filterKeys[i]][operations[j]])) {
                throw new Error(`Type of operation '${operations[j]}' value '${filter[filterKeys[i]][operations[j]]}' in filter object is not valid`)
              }
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
  User.isFilterValid(filter=filter)
  let text = 'WHERE'
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
    values.push(filter[field])
  }

  return {
    text,
    values,
  }
}

module.exports = {
  BaseModel,
  prepareWhereExpression,
}

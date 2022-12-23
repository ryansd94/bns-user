import _ from 'lodash'

const DiffTracker = {
  getDiff: function getDiff (newObject, oldObject, filterProperties = [], ignoreFields = []) {
    const cloneNewObject = _.cloneDeep(newObject)

    const trackChanges = (newObject, oldObject, objectName) => {
      const isRootLevel = !objectName
      const cloneNewObject = _.cloneDeep(newObject)

      return _.transform(cloneNewObject, (result, value, key) => {
        const currentField = !_.isEmpty(objectName) ? objectName + '.' + key : key


        let isDifferent = false

        if (_.isEmpty(filterProperties)) { // compare by order
          isDifferent = !_.isEqual(value, oldObject[key])
        } else { // compare by key
          isDifferent = _.isArray(oldObject)
            ? !_.isEqual(_.omit(value, getPropertiesByObjectName(objectName, ignoreFields)), _.omit(getOldObjectItem(oldObject, objectName, value, key), getPropertiesByObjectName(objectName, ignoreFields)))
            : !getPropertiesByObjectName(objectName, ignoreFields).includes(key) && !_.isEqual(value, oldObject[key])
        }
        
        if (isDifferent) {
          if (_.isObject(value) && _.isObject(oldObject[key])) {
            if (_.isArray(result)) {
              if (_.isEmpty(filterProperties)) { // ver 1
                result.push(trackChanges(value, oldObject[key], _.isArray(oldObject) ? objectName : key))
              } else { // ver 2
                let oldObjectItem = getOldObjectItem(oldObject, objectName, value, key)

                // added
                if (_.isEmpty(oldObjectItem)) {
                  result.push(value)
                } else { // modified
                  let item = trackChanges(value, oldObjectItem, _.isArray(oldObject) ? objectName : key)
                  if (!_.isEmpty(item)) {
                    result.push(item)
                  }
                }
              }
            } else {
              result[key] = trackChanges(value, oldObject[key], _.isArray(oldObject) ? objectName : key)
            }
          }
          else {
            if (_.isArray(result)) {
              if (_.isEmpty(filterProperties)) { // ver 1
                result.push(value)
              } else { // ver 2
                let oldObjectItem = getOldObjectItem(oldObject, objectName, value, key)

                // added
                if (_.isEmpty(oldObjectItem)) {
                  result.push(value)
                } else {
                  let item = trackChanges(value, oldObjectItem, _.isArray(oldObject) ? objectName : key)
                  if (!_.isEmpty(item)) {
                    result.push(item)
                  }
                }
              }
            } else {
              result[key] = value
            }
          }
        }
      })
    }

    const getPropertyByObjectName = (objectName, properties) => {
      if (_.isEmpty(objectName)) {
        return _.find(properties, function (property) {
          return property.indexOf('.') < 0
        })
      } else {
        let property = _.find(properties, function (property) {
          return property.indexOf(objectName) >= 0
        })
        return _.replace(property, objectName + '.', '')
      }
    }

    const getPropertiesByObjectName = (objectName, properties) => {
      if (_.isEmpty(objectName)) {
        return _.filter(properties, function (property) {
          return property.indexOf('.') < 0
        })
      } else {
        let prps = _.filter(properties, function (property) {
          return property.indexOf(objectName) >= 0
        })
        let finalProperties = []
        _.forEach(prps, (prp) => {
          finalProperties.push(_.replace(prp, objectName + '.', ''))
        })
        return finalProperties
      }
    }

    const getOldObjectItem = (oldObject, objectName, value, key) => {
      return _.isArray(oldObject)
        ? _.find(oldObject, function (o) {
          let filterProperty = getPropertyByObjectName(objectName, filterProperties)
          return _.isEmpty(filterProperty) ? _.isEqual(value, o) : _.isEqual(value[filterProperty], o[filterProperty])
        })
        : oldObject[key]
    }

    let diff = trackChanges(cloneNewObject, oldObject)
    return diff
  },
}
export default DiffTracker

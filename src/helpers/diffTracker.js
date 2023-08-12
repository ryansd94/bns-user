import _ from 'lodash'
import { EControlType, ERowStatus } from "configs"
import { deepFind } from "helpers/commonFunction"

const DiffTracker = {
  getChangeFieldsOnChange: function getChangeFieldsOnChange({ value, name, type = EControlType.textField, isDelete = false,
    getValues, originData = null, isEntity = true, onCustomGetChangeFields, nameGetValue }) {
    let changeFields = []
    if (!_.isNil(onCustomGetChangeFields)) {
      changeFields = onCustomGetChangeFields()
    } else {
      changeFields = getValues('changeFields') || []
    }
    let field = _.find(changeFields, (x) => x.key === name)
    let originValue = null
    let isDiffernt = false

    if (_.isNil(field)) {
      originValue = !_.isNil(originData) ? _.cloneDeep(originData) : getValues(nameGetValue || name)
    } else {
      originValue = field.originValue
    }

    if (type === EControlType.transferList) {
      originValue = _.sortBy(originValue)
    }

    if (_.isNumber(originValue) || _.isNumber(value)) {
      if (originValue != value) {
        isDiffernt = true
      }
    } else if (type === EControlType.transferList) {
      if (_.isNil(value)) {
        value = []
      }
      if (_.isNil(originValue)) {
        originValue = []
      }
      if (!_.isEqual(originValue, _.sortBy(value))) {
        isDiffernt = true
      }
    } else if (!_.isEqual(originValue, value)) {
      isDiffernt = true
    }

    if (isDiffernt === true) {
      let newValue = []
      if (type === EControlType.transferList || type === EControlType.multiSelect) {
        newValue = {}
        let deleteValues = _.difference(originValue, value)
        let addValues = _.difference(value, originValue)
        newValue = { deleteValues, addValues }
      } else if (type === EControlType.listId) {
        newValue = {}
        const originValueIds = _.cloneDeep(_.map(originValue, (x) => { return x.id }))
        const valueIds = _.cloneDeep(_.map(value, (x) => { return x.id }))
        let deleteValues = _.difference(originValueIds, valueIds)
        let addValues = _.difference(valueIds, originValueIds)
        newValue = {
          deleteValues: _.map(deleteValues, (x) => { return { id: x } }),
          addValues: _.map(addValues, (x) => { return { id: x } })
        }
      } else if (type === EControlType.listObject) {
        newValue = []
        if (!_.isNil(field)) {
          newValue = field.value
        }

        if (!_.isNil(value) && isDelete === false) {
          if (value.rowStatus === ERowStatus.addNew) {
            if (_.isNil(value.parentId)) {
              newValue.push(value)
            } else {
              let parent = deepFind(newValue, function (obj) {
                return obj.id === value.parentId
              }, 'childs')
              if (!_.isNil(parent)) {
                if (!_.isNil(parent.childs)) {
                  parent.childs.push(value)
                } else {
                  parent.childs = [{ ...value }]
                }
              } else {
                newValue.push(value)
              }
            }
          } else {
            let updatedValue = deepFind(newValue, function (obj) {
              return obj.id === value.id
            }, 'childs')
            if (!_.isNil(updatedValue)) {
              _.assign(updatedValue, value);
            } else {
              newValue.push(value)
            }
          }
        } else {
          const deleteValue = deepFind(newValue, function (x) {
            return x.id === value.id
          }, 'childs')
          if (_.isNil(deleteValue)) {
            newValue.push(value)
          } else {
            let parentDeleted = deepFind(newValue, function (x) {
              return x.id === deleteValue.parentId
            }, 'childs')
            if (!_.isNil(parentDeleted)) {
              parentDeleted.childs = _.filter(parentDeleted.childs, (x) => x.id !== deleteValue.id)
            } else {
              newValue = _.filter(newValue, (x) => x.id !== deleteValue.id)
            }
          }
        }
      } else {
        newValue = value
      }

      if (_.isNil(field)) {
        if (type === EControlType.listObject) {
          if (!_.isEmpty(newValue)) {
            changeFields.push({ key: name, value: newValue, originValue, type, isEntity })
          }
        } else {
          changeFields.push({ key: name, value: newValue, originValue, type, isEntity })
        }
      } else {
        if (!_.isEmpty(newValue)) {
          field.value = newValue
        } else {
          changeFields = _.filter(changeFields, (x) => x.key !== name)
        }
      }
    } else {
      if (!_.isNil(field)) {
        changeFields = _.filter(changeFields, (x) => x.key !== name)
      }
    }
    return changeFields
  },
  onValueChange: function ({ editData, value, name, type = EControlType.textField, isDelete = false,
    getValues, setValue, eventEmitter, buttonId, isEntity, originData = null, onCustomSetValue, onCustomGetChangeFields, nameGetValue }) {
    if (_.isNil(editData)) return
    let changeFields = this.getChangeFieldsOnChange({ value, name, type, isDelete, getValues, originData, isEntity, onCustomGetChangeFields, nameGetValue })
    if (onCustomSetValue) {
      onCustomSetValue(changeFields)
    } else {
      setValue('changeFields', changeFields)
    }
    eventEmitter.emit('onChangeButtonDisabled', { buttonId, disabled: !_.isEmpty(changeFields) ? false : true })
  }
}
export default DiffTracker

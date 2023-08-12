import * as Yup from "yup"

export const getCustomResolverTab = async (values, context, validationSchemaTab) => {
    let errors = {}
    let errorTab = []
    const validationPromises = validationSchemaTab.map(async (item) => {
        try {
            await Yup.object().shape(item.validation).validate(values, { abortEarly: false })
        } catch (validationErrors) {
            errorTab.push(item.tabIndex)
            validationErrors.inner.reduce((acc, error) => {
                errors[error.path] = { message: error.message }
            }, {})
        }
    })

    await Promise.all(validationPromises)
    let errorResult = { values, errors, errorTab }
    return errorResult
}

export const getCustomResolverFormArray = async (values, validationSchema) => {
    let errors = {}
    try {
        await Yup.object().shape(validationSchema).validate(values, { abortEarly: false })
    } catch (validationErrors) {
        validationErrors.inner.reduce((acc, error) => {
            errors[error.path] = { message: error.message }
        }, {})
    }

    let errorResult = { values, errors }
    return errorResult
}
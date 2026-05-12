//ff:func feature=utils type=model control=sequence
//ff:type feature=utils type=model
//ff:what Body
/**
 * @module
 * Body utility.
 */

import { HonoRequest } from '../request'
import type { BodyData } from './body_data_def.js'
import type { ParseBodyOptions } from './parse_body_options_def.js'
import type { BodyDataValue } from './body_data_value_def.js'

export type { BodyDataValueDot } from './body_data_value_dot_def.js'
export type { BodyDataValueDotAll } from './body_data_value_dot_all_def.js'
export type { SimplifyBodyData } from './simplify_body_data_def.js'
export type { BodyDataValueComponent } from './body_data_value_component_def.js'
export type { BodyDataValueObject } from './body_data_value_object_def.js'
export type { BodyDataValue } from './body_data_value_def.js'
export type { BodyData } from './body_data_def.js'
export type { ParseBodyOptions } from './parse_body_options_def.js'


/**
 * Parses the body of a request based on the provided options.
 *
 * @template T - The type of the parsed body data.
 * @param {HonoRequest | Request} request - The request object to parse.
 * @param {Partial<ParseBodyOptions>} [options] - Options for parsing the body.
 * @returns {Promise<T>} The parsed body data.
 */
interface ParseBody {
  <Options extends Partial<ParseBodyOptions>, T extends BodyData<Options>>(
    request: HonoRequest | Request,
    options?: Options
  ): Promise<T>
  <T extends BodyData>(
    request: HonoRequest | Request,
    options?: Partial<ParseBodyOptions>
  ): Promise<T>
}
export const parseBody: ParseBody = async (
  request: HonoRequest | Request,
  options = Object.create(null)
) => {
  const { all = false, dot = false } = options

  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers
  const contentType = headers.get('Content-Type')

  if (
    contentType?.startsWith('multipart/form-data') ||
    contentType?.startsWith('application/x-www-form-urlencoded')
  ) {
    return parseFormData(request, { all, dot })
  }

  return {}
}

/**
 * Parses form data from a request.
 *
 * @template T - The type of the parsed body data.
 * @param {HonoRequest | Request} request - The request object containing form data.
 * @param {ParseBodyOptions} options - Options for parsing the form data.
 * @returns {Promise<T>} The parsed body data.
 */
async function parseFormData<T extends BodyData>(
  request: HonoRequest | Request,
  options: ParseBodyOptions
): Promise<T> {
  const formData = await (request as Request).formData()

  if (formData) {
    return convertFormDataToBodyData<T>(formData, options)
  }

  return {} as T
}

/**
 * Converts form data to body data based on the provided options.
 *
 * @template T - The type of the parsed body data.
 * @param {FormData} formData - The form data to convert.
 * @param {ParseBodyOptions} options - Options for parsing the form data.
 * @returns {T} The converted body data.
 */
const convertFormDataToBodyData = <T extends BodyData = BodyData>(formData: FormData, options: ParseBodyOptions): T => {
  const form: BodyData = Object.create(null)

  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith('[]')

    if (!shouldParseAllValues) {
      form[key] = value
    } else {
      handleParsingAllValues(form, key, value)
    }
  })

  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes('.')

      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value)
        delete form[key]
      }
    })
  }

  return form as T
}

/**
 * Handles parsing all values for a given key, supporting multiple values as arrays.
 *
 * @param {BodyData} form - The form data object.
 * @param {string} key - The key to parse.
 * @param {FormDataEntryValue} value - The value to assign.
 */
const handleParsingAllValues = (
  form: BodyData<{ all: true }>,
  key: string,
  value: FormDataEntryValue
): void => {
  if (form[key] !== undefined) {
    if (Array.isArray(form[key])) {
      ;(form[key] as (string | File)[]).push(value)
    } else {
      form[key] = [form[key] as string | File, value]
    }
  } else {
    if (!key.endsWith('[]')) {
      form[key] = value
    } else {
      form[key] = [value]
    }
  }
}

/**
 * Handles parsing nested values using dot notation keys.
 *
 * @param {BodyData} form - The form data object.
 * @param {string} key - The dot notation key.
 * @param {BodyDataValue} value - The value to assign.
 */
const handleParsingNestedValues = (
  form: BodyData,
  key: string,
  value: BodyDataValue<Partial<ParseBodyOptions>>
): void => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return
  }

  let nestedForm = form
  const keys = key.split('.')

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      nestedForm[key] = value
    } else {
      if (
        !nestedForm[key] ||
        typeof nestedForm[key] !== 'object' ||
        Array.isArray(nestedForm[key]) ||
        nestedForm[key] instanceof File
      ) {
        nestedForm[key] = Object.create(null)
      }
      nestedForm = nestedForm[key] as unknown as BodyData
    }
  })
}

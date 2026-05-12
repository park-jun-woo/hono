//ff:type feature=core type=model
//ff:what Types
/**
 * @module
 * This module contains some type definitions for the Hono modules.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Context } from './context'
import type { HonoBase } from './hono-base'
import type { CustomHeader, RequestHeader } from './utils/headers'
import type { StatusCode } from './utils/http-status'
import type {
  IfAnyThenEmptyObject,
  IsAny,
  JSONValue,
  RemoveBlankRecord,
  Simplify,
  UnionToIntersection,
} from './utils/types'

export type { Bindings } from './bindings.js'
export type { Variables } from './variables.js'
export type { BlankEnv } from './blank_env.js'
export type { Env } from './env.js'
export type { Next } from './next.js'
export type { ExtractInput } from './extract_input.js'
export type { Input } from './input.js'
export type { BlankSchema } from './blank_schema.js'
export type { BlankInput } from './blank_input.js'
export type { HandlerResponse } from './handler_response.js'
export type { Handler } from './handler.js'
export type { MiddlewareHandler } from './middleware_handler.js'
export type { H } from './h.js'
export type { NotFoundHandler } from './not_found_handler.js'
export type { ErrorHandler } from './error_handler.js'
export type { ToSchemaOutput } from './to_schema_output.js'
export type { ToSchema } from './to_schema.js'
export type { Schema } from './schema.js'
export type { AddSchemaIfHasResponse } from './add_schema_if_has_response.js'
export type { Endpoint } from './endpoint.js'
export type { ExtractParams } from './extract_params.js'
export type { FlattenIfIntersect } from './flatten_if_intersect.js'
export type { MergeSchemaPath } from './merge_schema_path.js'
export type { MergeEndpointParamsWithPath } from './merge_endpoint_params_with_path.js'
export type { AddParam } from './add_param.js'
export type { AddDollar } from './add_dollar.js'
export type { MergePath } from './merge_path.js'
export type { KnownResponseFormat } from './known_response_format.js'
export type { ResponseFormat } from './response_format.js'
export type { TypedResponse } from './typed_response.js'
export type { MergeTypedResponse } from './merge_typed_response.js'
export type { ExtractTypedResponseOnly } from './extract_typed_response_only.js'
export type { MergeMiddlewareResponse } from './merge_middleware_response.js'
export type { FormValue } from './form_value.js'
export type { ParsedFormValue } from './parsed_form_value.js'
export type { ValidationTargets } from './validation_targets.js'
export type { ParamKey } from './param_key.js'
export type { ParamKeys } from './param_keys.js'
export type { ParamKeyToRecord } from './param_key_to_record.js'
export type { InputToDataByTarget } from './input_to_data_by_target.js'
export type { RemoveQuestion } from './remove_question.js'
export type { ExtractSchema } from './extract_schema.js'
export type { ExtractSchemaForStatusCode } from './extract_schema_for_status_code.js'
export type { ExtractHandlerResponse } from './extract_handler_response.js'
export type { ProcessHead } from './process_head.js'
export type { IntersectNonAnyTypes } from './intersect_non_any_types.js'
export type { RouterRoute } from './router_route.js'
export type { NotFoundResponse } from './not_found_response.js'
export type { HTTPResponseError } from './http_response_error.js'
export type { HandlerInterface } from './handler_interface.js'
export type { MiddlewareHandlerInterface } from './middleware_handler_interface.js'
export type { OnHandlerInterface } from './on_handler_interface.js'


////////////////////////////////////////
//////                            //////
//////           Values           //////
//////                            //////
////////////////////////////////////////
////////////////////////////////////////
//////                            //////
//////          Routes            //////
//////                            //////
////////////////////////////////////////
////////////////////////////////////////
//////                            //////
//////          Handlers          //////
//////                            //////
////////////////////////////////////////
////////////////////////////////////////
//////                            //////
//////     HandlerInterface       //////
//////                            //////
////////////////////////////////////////
////////////////////////////////////////
//////                            //////
////// MiddlewareHandlerInterface //////
//////                            //////
////////////////////////////////////////
////////////////////////////////////////
//////                            //////
//////     OnHandlerInterface     //////
//////                            //////
////////////////////////////////////////
////////////////////////////////////////
//////                            //////
//////           ToSchema           //////
//////                            //////
////////////////////////////////////////
////////////////////////////////////////
//////                            //////
//////        TypedResponse       //////
//////                            //////
////////////////////////////////////////
////////////////////////////////////////
//////                             /////
//////      ValidationTargets      /////
//////                             /////
////////////////////////////////////////
////////////////////////////////////////
//////                            //////
//////      Path parameters       //////
//////                            //////
////////////////////////////////////////
////////////////////////////////////////
//////                            //////
/////       For HonoRequest       //////
//////                            //////
////////////////////////////////////////
////////////////////////////////////////
//////                            //////
//////         Utilities          //////
//////                            //////
////////////////////////////////////////
////////////////////////////////////////
//////                            //////
//////         FetchEvent         //////
//////                            //////
////////////////////////////////////////

export abstract class FetchEventLike {
  abstract readonly request: Request
  abstract respondWith(promise: Response | Promise<Response>): void
  abstract passThroughOnException(): void
  abstract waitUntil(promise: Promise<void>): void
}

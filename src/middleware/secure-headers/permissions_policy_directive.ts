//ff:type feature=middleware type=handler
//ff:what Permissions policy directive
import type { StandardizedFeatures } from './standardized_features.js'
import type { ProposedFeatures } from './proposed_features.js'
import type { ExperimentalFeatures } from './permissions-policy.js'

// https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md
export type PermissionsPolicyDirective =
  | StandardizedFeatures
  | ProposedFeatures
  | ExperimentalFeatures

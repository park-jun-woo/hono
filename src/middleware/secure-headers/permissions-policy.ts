//ff:type feature=middleware type=handler
//ff:what Permissions policy


export type { PermissionsPolicyDirective } from './permissions_policy_directive.js'
export type { StandardizedFeatures } from './standardized_features.js'
export type { ProposedFeatures } from './proposed_features.js'

// https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md
/**
 * These features generally have an explainer only, but may be available for experimentation by web developers.
 */
export type ExperimentalFeatures =
  | 'allScreensCapture'
  | 'browsingTopics'
  | 'capturedSurfaceControl'
  | 'conversionMeasurement'
  | 'digitalCredentialsGet'
  | 'focusWithoutUserActivation'
  | 'joinAdInterestGroup'
  | 'localFonts'
  | 'runAdAuction'
  | 'smartCard'
  | 'syncScript'
  | 'trustTokenRedemption'
  | 'unload'
  | 'verticalScroll'

/**
 * vue-easymde does `import marked from 'marked'` (default export).
 * marked@4 only ships named exports — provide a default for Vite ESM.
 */
export {
  Hooks,
  Lexer,
  Parser,
  Renderer,
  Slugger,
  TextRenderer,
  Tokenizer,
  defaults,
  getDefaults,
  lexer,
  marked,
  options,
  parse,
  parseInline,
  parser,
  setOptions,
  use,
  walkTokens,
} from '../../../node_modules/marked/lib/marked.esm.js'

import { marked as markedFn } from '../../../node_modules/marked/lib/marked.esm.js'

export default markedFn

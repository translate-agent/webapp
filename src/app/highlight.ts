/* eslint-disable no-misleading-character-class */

import hljs from 'highlight.js'

/*
name-start = ALPHA / "_"
           / %xC0-D6 / %xD8-F6 / %xF8-2FF
           / %x370-37D / %x37F-1FFF / %x200C-200D
           / %x2070-218F / %x2C00-2FEF / %x3001-D7FF
           / %xF900-FDCF / %xFDF0-FFFC / %x10000-EFFFF
name-char  = name-start / DIGIT / "-" / "."
           / %xB7 / %x300-36F / %x203F-2040
*/
const regex = hljs.regex

// TODO: rewrite as array with regex.either function
const _NAME_START =
  /[a-zA-Z_\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c-\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffc]/

const _NAME_CHAR = new RegExp(
  '(?:' + _NAME_START.source + '|' + /[0-9\-.\u00b7\u0300-\u036f\u203f-\u2040]/.source + ')',
)

const NAME = new RegExp(_NAME_START.source + _NAME_CHAR.source + '*')

const VARIABLE = new RegExp('\\$' + NAME.source)

// eslint-disable-next-line no-control-regex
const _CONTENT_CHAR = /[\x00-\x08\x0b-\x0c\x0e-\x19\x21-\x2d\x2f-\x3f\x41-\x5b\x5d-\x7a\x7e-\ud7ff\ue000-\uffff]/

const _QUOTED_CHAR = new RegExp('(?:' + _CONTENT_CHAR.source + '|[\\s\\.@\\{\\}]' + ')')

const _QUOTED_ESCAPE = /\x5c[\x5c|]/

const QUOTED = new RegExp('\\|(' + _QUOTED_CHAR.source + '|' + _QUOTED_ESCAPE.source + ')*\\|')

const _NUMBER_LITERAL = /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?/

const UNQUOTED = new RegExp('(?:' + NAME.source + '|' + _NUMBER_LITERAL.source + ')')

const IDENTIFIER = new RegExp('(?:' + NAME.source + ':)?' + NAME.source)

const LITERAL = new RegExp('(?:' + QUOTED.source + '|' + UNQUOTED.source + ')')

const KEY = new RegExp('(?:' + LITERAL.source + '|\\*)')

const TEXT_CHAR = new RegExp('(?:' + _CONTENT_CHAR.source + '|[\\s\\.@\\|]' + ')')

const TEXT_ESCAPE = /\x5c[\x5c\\{\\}]/

const EQUALS = {
  scope: 'operator',
  match: /=/,
}

const ATTRIBUTE = {
  scope: 'attribute',
  match: new RegExp('@' + IDENTIFIER.source),
  beginScope: 'property',
  contains: [
    EQUALS,
    {
      scope: 'literal',
      match: LITERAL,
    },
    {
      scope: 'variable',
      match: VARIABLE,
    },
  ],
}

const OPTION = {
  scope: 'option',
  begin: regex.concat(IDENTIFIER, regex.lookahead(/\s*=\s*/)),
  beginScope: 'property',
  contains: [
    EQUALS,
    {
      scope: 'literal',
      match: LITERAL,
    },
    {
      scope: 'variable',
      match: VARIABLE,
    },
  ],
}

const EXPRESSION = [
  ATTRIBUTE,
  OPTION,
  {
    scope: 'title',
    match: new RegExp(':' + IDENTIFIER.source),
  },
  {
    scope: 'literal',
    match: LITERAL,
  },
  {
    scope: 'variable',
    match: VARIABLE,
  },
]

const VARIABLE_EXPRESSION = [
  ATTRIBUTE,
  OPTION,
  {
    scope: 'title',
    match: new RegExp(':' + IDENTIFIER.source),
  },
  {
    scope: 'variable',
    match: VARIABLE,
  },
]

const VARIABLE_MODE = {
  scope: 'variable',
  match: VARIABLE,
}

// const PLACEHOLDER = {
//   scope: 'expression',
//   begin: '{',
//   end: '}',
//   beginScope: 'punctuation',
//   endScope: 'punctuation',
//   contains: [
//     ATTRIBUTE,
//     OPTION,
//     {
//       scope: 'title',
//       match: new RegExp(':' + IDENTIFIER.source),
//     },
//     {
//       scope: 'literal',
//       match: LITERAL,
//     },
//     {
//       scope: 'variable',
//       match: VARIABLE,
//     },
//   ],
// }

export const messageformat2 = {
  name: 'messageformat2',
  contains: [
    {
      scope: 'local_declaration',
      begin: /.local/,
      end: /$/,
      beginScope: 'keyword',
      contains: [
        VARIABLE_MODE,
        EQUALS,
        {
          scope: 'expression',
          begin: '{',
          end: '}',
          beginScope: 'punctuation',
          endScope: 'punctuation',
          contains: EXPRESSION,
        },
      ],
    },
    {
      scope: 'input_declaration',
      begin: /.input/,
      end: /$/,
      beginScope: 'keyword',
      contains: [
        {
          scope: 'expression',
          begin: '{',
          end: '}',
          beginScope: 'punctuation',
          endScope: 'punctuation',
          contains: VARIABLE_EXPRESSION,
        },
      ],
    },
    {
      scope: 'matcher',
      begin: /.match/,
      end: /\$$/,
      beginScope: 'keyword',
      contains: [
        {
          scope: 'expression',
          begin: '{',
          end: '}',
          beginScope: 'punctuation',
          endScope: 'punctuation',
          contains: EXPRESSION,
        },
        {
          scope: 'variant',
          begin: KEY,
          beginScope: 'key',
          end: /$/,
        },
      ],
    },
  ],
}

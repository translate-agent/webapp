import { HLJSApi } from 'highlight.js'

// https://github.com/unicode-org/message-format-wg/blob/main/spec/message.abnf#L36

function messageFormat2(hljs: HLJSApi) {
  const regex = hljs.regex
  /*
name-start = ALPHA / "_"
           / %xC0-D6 / %xD8-F6 / %xF8-2FF
           / %x370-37D / %x37F-1FFF / %x200C-200D
           / %x2070-218F / %x2C00-2FEF / %x3001-D7FF
           / %xF900-FDCF / %xFDF0-FFFC / %x10000-EFFFF
name-char  = name-start / DIGIT / "-" / "."
           / %xB7 / %x300-36F / %x203F-2040
*/

  // NOTE: char range %x10000-EFFFF *IS NOT* included. Hopefully no one uses it :fingerscrossed:

  const _NAME_START =
    /[a-zA-Z_\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c-\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffc]/

  // eslint-disable-next-line no-misleading-character-class
  const _NAME_CHAR = regex.either(_NAME_START, /[0-9\-.\u00b7\u0300-\u036F\u203f-\u2040]/)

  const NAME = regex.concat(_NAME_START, _NAME_CHAR, '*')

  const VARIABLE = regex.concat('\\$', NAME)

  /*
  content-char      = %x00-08        ; omit HTAB (%x09) and LF (%x0A)
                  / %x0B-0C        ; omit CR (%x0D)
                  / %x0E-19        ; omit SP (%x20)
                  / %x21-2D        ; omit . (%x2E)
                  / %x2F-3F        ; omit @ (%x40)
                  / %x41-5B        ; omit \ (%x5C)
                  / %x5D-7A        ; omit { | } (%x7B-7D)
                  / %x7E-D7FF      ; omit surrogates
                  / %xE000-10FFFF
  */

  // eslint-disable-next-line no-control-regex
  const _CONTENT_CHAR = /[\x00-\x08\x0b-\x0c\x0e-\x19\x21-\x2d\x2f-\x3f\x41-\x5b\x5d-\x7a\x7e-\ud7ff\ue000-\uffff]/

  const _QUOTED_CHAR = regex.either(_CONTENT_CHAR, '[\\s\\.@\\{\\}]')

  const _QUOTED_ESCAPE = /\x5c[\x5c|]/

  const QUOTED = regex.concat('\\|(', _QUOTED_CHAR, '|', _QUOTED_ESCAPE.source, ')*\\|')

  // number-literal = ["-"] (%x30 / (%x31-39 *DIGIT)) ["." 1*DIGIT] [%i"e" ["-" / "+"] 1*DIGIT]

  const _NUMBER_LITERAL = /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?/

  const UNQUOTED = regex.either(NAME, _NUMBER_LITERAL)

  const IDENTIFIER = regex.concat(regex.optional(NAME), NAME)

  const LITERAL = regex.either(QUOTED, UNQUOTED)

  const KEY = regex.either(LITERAL, '\\*')

  const TEXT_CHAR = regex.either(_CONTENT_CHAR, '[\\s\\.@\\|]')

  const TEXT_ESCAPE = /\x5c[\x5c\\{\\}]/

  const EQUALS = {
    scope: 'operator',
    match: /\s*=\s*/,
  }

  const VARIABLE_MODE = {
    scope: 'variable',
    match: VARIABLE,
  }

  const FUNCTION = {
    scope: 'title',
    match: regex.concat(':', IDENTIFIER),
  }

  const LITERAL_MODE = {
    scope: 'literal',
    match: LITERAL,
  }

  const ATTRIBUTE = {
    scope: 'attribute',
    match: regex.concat('@', IDENTIFIER),
    beginScope: 'property',
    contains: [EQUALS, LITERAL_MODE, VARIABLE_MODE],
  }

  const OPTION = {
    scope: 'option',
    begin: regex.concat(IDENTIFIER, regex.lookahead(/\s*=\s*/)),
    beginScope: 'property',
    contains: [EQUALS, LITERAL_MODE, VARIABLE_MODE],
  }

  const EXPRESSION = [ATTRIBUTE, OPTION, FUNCTION, LITERAL_MODE, VARIABLE_MODE]

  const VARIABLE_EXPRESSION = [ATTRIBUTE, OPTION, FUNCTION, VARIABLE_MODE]

  const PLACEHOLDER = {
    scope: 'expression',
    begin: '{',
    end: '}',
    beginScope: 'punctuation',
    endScope: 'punctuation',
    contains: [ATTRIBUTE, OPTION, FUNCTION, LITERAL_MODE, VARIABLE_MODE],
  }

  const QOUTED_PATTERN = {
    scope: 'quoted_pattern',
    begin: /{{/,
    beginScope: 'punctuation',
    end: regex.concat('}}', /(?!})/),
    endScope: 'punctuation',
    contains: [
      PLACEHOLDER,
      {
        scope: 'text',
        match: regex.concat(TEXT_CHAR, '+'),
      },
      { scope: 'escape', match: TEXT_ESCAPE },
    ],
  }

  return {
    name: 'messageformat2',
    contains: [
      {
        scope: 'local_declaration',
        begin: /.local/,
        end: regex.concat(/^/, regex.lookahead('\\.')),
        returnEnd: true,
        beginScope: 'keyword',
        contains: [
          VARIABLE_MODE,
          EQUALS,
          QOUTED_PATTERN,
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
        end: regex.concat(/^/, regex.lookahead('\\.')),
        returnEnd: true,
        beginScope: 'keyword',
        contains: [
          QOUTED_PATTERN,
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
        end: regex.concat(/^/, regex.lookahead('\\.')),
        returnEnd: true,
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
            begin: regex.concat(KEY, '(\\s', KEY, ')*'),
            returnBegin: true,
            end: /$/,
            contains: [QOUTED_PATTERN, { scope: 'key', match: KEY }],
          },
        ],
      },
      {
        scope: 'simple_message',
        begin: regex.concat(/^/, regex.either(_CONTENT_CHAR, /(?:\s|[^\n])/, '@', '|')),
        end: regex.concat(/^/, regex.lookahead('\\.')),
        returnEnd: true,
        contains: [
          {
            scope: 'markup',
            begin: regex.concat('{', regex.lookahead(/\s*[#/]/)),
            beginScope: 'punctuation',
            end: '/?}',
            endScope: 'punctuation',
            contains: [
              ATTRIBUTE,
              OPTION,
              {
                scope: 'title',
                begin: regex.either('#', /\/(?!})/),
                end: regex.either('\\s', '}'),
                returnEnd: true,
              },
            ],
          },
          {
            scope: 'expression',
            begin: '{',
            end: '}',
            beginScope: 'punctuation',
            endScope: 'punctuation',
            contains: EXPRESSION,
          },
          // {
          //   scope: 'text',
          //   match: regex.concat(TEXT_CHAR, '+'),
          // },
          { scope: 'escape', match: TEXT_ESCAPE },
        ],
      },
    ],
  }
}

export { messageFormat2 as default }

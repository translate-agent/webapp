/* eslint-disable no-misleading-character-class */
import { HLJSApi } from 'highlight.js'

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

  // const _NAME_START_ARRAY = [
  //   '[a-zA-Z]',
  //   '_',
  //   '\xC0-\xD6',
  //   '\xD8-\xF6',
  //   '\xF8-\u02ff',
  //   '\u0370-\u037d',
  //   '\u037f-\u1fff',
  //   '\u200c-\u200d',
  //   '\u2070-\u218f',
  //   '\u2c00-\u2fef',
  //   '\u3001-\ud7ff',
  //   '\uf900-\ufdcf',
  //   '\ufdf0-\ufffc',
  // ]

  // const _NAME_CHAR_ARRAY = ['[0-9]', '-', '.', '\xB7', '\u0300-\u036f', '\u203f-\u2040']

  // TODO: rewrite as array with regex.either function
  const _NAME_START =
    /[a-zA-Z_\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c-\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffc]/

  const _NAME_CHAR = regex.either(regex.concat(_NAME_START, '|', /[0-9\-.\u00b7\u0300-\u036f\u203f-\u2040]/))

  // const _NAME_CHAR = new RegExp(
  //   '(?:' + _NAME_START.source + '|' + /[0-9\-.\u00b7\u0300-\u036f\u203f-\u2040]/.source + ')',
  // )

  const NAME = regex.concat(_NAME_START, _NAME_CHAR, '*')

  // const NAME = new RegExp(_NAME_START.source + _NAME_CHAR.source + '*')

  const VARIABLE = regex.concat('\\$', NAME)

  // const VARIABLE = new RegExp('\\$' + NAME2)

  // eslint-disable-next-line no-control-regex
  const _CONTENT_CHAR = /[\x00-\x08\x0b-\x0c\x0e-\x19\x21-\x2d\x2f-\x3f\x41-\x5b\x5d-\x7a\x7e-\ud7ff\ue000-\uffff]/

  // const _QUOTED_CHAR = new RegExp('(?:' + _CONTENT_CHAR.source + '|[\\s\\.@\\{\\}]' + ')')

  const _QUOTED_CHAR2 = regex.either(regex.concat(_CONTENT_CHAR, '|[\\s\\.@\\{\\}]'))

  const _QUOTED_ESCAPE = /\x5c[\x5c|]/

  const QUOTED2 = regex.concat('\\|(', _QUOTED_CHAR2, '|', _QUOTED_ESCAPE.source, ')*\\|')

  // const QUOTED = new RegExp('\\|(' + _QUOTED_CHAR.source + '|' + _QUOTED_ESCAPE.source + ')*\\|')

  const _NUMBER_LITERAL = /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?/

  const UNQUOTED2 = regex.either(regex.concat(NAME, '|', _NUMBER_LITERAL))

  // const UNQUOTED = new RegExp('(?:' + NAME2 + '|' + _NUMBER_LITERAL.source + ')')

  const IDENTIFIER = regex.concat(regex.optional(NAME), NAME)

  // const IDENTIFIER = new RegExp('(?:' + NAME2 + ':)?' + NAME2)

  const LITERAL = regex.either(regex.concat(QUOTED2, '|', UNQUOTED2))
  // console.log(LITERAL)

  // const LITERAL = new RegExp('(?:' + QUOTED.source + '|' + UNQUOTED.source + ')')

  const KEY = regex.either(LITERAL, '\\*')

  const TEXT_CHAR = regex.either(_CONTENT_CHAR, '|[\\s\\.@\\|]')

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
            // beginScope: 'key',
            end: /$/,
            contains: [QOUTED_PATTERN, { scope: 'literal', match: KEY }],
          },
        ],
      },
      {
        scope: 'simple_message',
        begin: regex.concat(/^/, regex.either(_CONTENT_CHAR, /(?:\s|[^\n])/, '@', '|')),
        end: regex.concat(/^/, regex.lookahead('\\.')),
        returnEnd: true,
        // returnBegin: true,
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

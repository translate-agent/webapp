// const VARIABLE = {
//   scope: 'variable',
//   begin: /\\$[a-zA-Z_][a-zA-Z0-9_]*/,
// }

export const messageformat2 = {
  name: 'messageformat2',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  case_insensitive: true,
  // Todo: keyword to patter
  // keywords: {
  //   $pattern: /\.(local|input)/,
  //   keyword: '.local .input',
  // },
  contains: [
    {
      scope: 'local_declaration',
      begin: '\\.local|\\.input',
      end: /$/,
      keywords: 'local input',
      contains: [
        {
          scope: 'variable',
          begin: '\\$[a-zA-Z0-9_]+',
          end: '\\s*',
        },
        { scope: 'operator', begin: '=', end: '\\s' },
        {
          scope: 'expression',
          begin: '{',
          end: '}',
          contains: [
            {
              scope: 'literal',
              begin: /\|/,
              end: /\|/,
            },
            {
              scope: 'literal',
              // missing "name-start" and "name-char" ranges
              begin: /[a-zA-Z_][a-zA-Z0-9\-.]*/,
            },
            {
              scope: 'literal',
              begin: /-?(0|[1-9]\d*)(\.\d+)?([eE][-+]{0,1}\d+)?/,
            },
          ],
        },
      ],
    },
    // {
    //   scope: 'variable',
    //   begin: /{$[a-zA-Z_][a-zA-Z0-9_]}/,
    // },
    // {
    //   scope: 'function',
    //   begin: /{[:+-][a-zA-Z][a-zA-Z0-9]+/,
    // },
    // {
    //   className: 'parameter',
    //   begin: /[a-zA-Z]+=[a-zA-Z]+/,
    // },
    {
      className: 'matcher',
      begin: '\\.match',
      end: /\\}$/,
      // keywords: 'match',
      contains: [
        {
          className: 'selector',
          begin: '\\$[a-zA-Z_]\\w*',
          end: '\\s',
        },
        // {
        //   scope: 'selector',
        //   // begin: /\{\$[^:}]+\s*:[^}]+\}/,
        //   begin: /{/,
        //   end: /}/,
        //   contains: [
        //     {
        //       scope: 'variable',
        //       begin: /\$[^:}]+/,
        //     },
        //     {
        //       scope: 'function',
        //       begin: /[+:-][a-zA-Z][a-zA-Z0-9]*/,
        //     },
        //   ],
        // },
        {
          scope: 'variant',
          begin: /\bwhen\b/,
          end: /\\}$/,
          keywords: 'when',
          contains: [
            {
              begin: '{',
              end: '}',
              contains: [
                {
                  className: 'placeholder',
                  begin: /{:/,
                  end: /}/,
                  contains: [
                    {
                      scope: 'function',
                      begin: /{[:+-][a-zA-Z][a-zA-Z0-9]+/,
                    },
                    {
                      className: 'parameter',
                      begin: /[a-zA-Z]+=[a-zA-Z]+/,
                    },
                  ],
                },
                {
                  className: 'text',
                  begin: /''/,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

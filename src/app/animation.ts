import { animate, group, state, style, transition, trigger } from '@angular/animations'

export const slideInOut = [
  trigger('slideInOut', [
    state(
      'in',
      style({
        opacity: '1',
        visibility: 'visible',
        transform: 'translateX(0)',
      }),
    ),
    state(
      'out',
      style({
        maxHeight: '0px',
        opacity: '0',
        visibility: 'hidden',
        transform: 'translateY(200%)',
        background: 'lightblue',
      }),
    ),
    transition('in => out', [
      group([
        animate(
          '700ms ease-in-out',
          style({
            visibility: 'hidden',
          }),
        ),
        animate(
          '400ms ease-in-out',
          style({
            background: 'lightblue',
            transform: 'translateX(-200%)',
          }),
        ),
      ]),
    ]),
  ]),
]

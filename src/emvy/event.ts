import xs, { Stream, Producer, Listener } from 'xstream'

import { targetMatches } from './matches'

export const createEventStream = ((eventStreams: any) =>
  (eventName: string): Stream<Event> =>
    eventName in eventStreams ?
      eventStreams[eventName]
      : eventStreams[eventName] = xs.create({
        start(listener: Listener<Event>) {
          this.target
          this.listener = listener.next.bind(listener)
          switch (eventName) {
            case 'resize':
            case 'popstate':
            case 'hashchange':
              this.target = window
              break;
            default:
              this.target = document
          }
          this.target.addEventListener(eventName, this.listener)
        },
        stop() {
          this.document.removeEventListener(eventName, this.listener)
        }
      } as Producer<Event>)
)({})

export const on = (eventName: string, selector: string): Stream<Event> => {
  const event$ = createEventStream(eventName)
  return selector ?
    event$.filter(targetMatches(selector))
    : event$
}

export const eventStreamPlugin = (input: any) => ({
  ...input,
  on
})

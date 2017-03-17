import xs, { Stream, Producer, Listener } from 'xstream'

import { targetMatches } from './matches'

export const createEventStream = ((eventStreams) =>
  (eventName: string): Stream<Event> =>
    eventName in eventStreams ?
      eventStreams[eventName]
      : eventStreams[eventName] = xs.create({
        start(listener: Listener<Event>) {
          this.listener = listener.next.bind(listener)
          document.addEventListener(eventName, this.listener)
        },
        stop() {
          document.removeEventListener(eventName, this.listener)
        }
      } as Producer<Event>)
)({})

export const on = (eventName: string, selector: string): Stream<Event> => {
  const event$ = createEventStream(eventName)
  return selector ?
    event$.filter(targetMatches(selector))
    : event$
}

export const eventStreamPlugin = (input) => ({
  ...input,
  on
})

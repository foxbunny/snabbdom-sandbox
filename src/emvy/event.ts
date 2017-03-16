import xs, { Stream, Producer, Listener } from 'xstream'

import { targetMatches } from './matches'

export const on = (eventName: string, selector: string): Stream<Event> => {
  const event$: Stream<Event> = xs.create({
    start(listener: Listener<Event>) {
      this.listener = listener.next.bind(listener)
      document.addEventListener(eventName, this.listener)
    },
    stop() {
      document.removeEventListener(eventName, this.listener)
    }
  } as Producer<Event>)

  return selector ?
    event$.filter(targetMatches(selector))
    : event$
}

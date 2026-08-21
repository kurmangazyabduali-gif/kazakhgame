import type { Item } from '../../engine/scenario/types'

export function markItemPlaced(item: Item): Item {
  return {
    ...item,
    state: {
      ...item.state,
      placed: true,
    },
  }
}

import type { NPC } from '../../engine/scenario/types'

export type GuestState = NonNullable<NPC['state']>

export function setGuestState(guest: NPC, state: GuestState): NPC {
  return { ...guest, state }
}

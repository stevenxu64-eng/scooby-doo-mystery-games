import { findPath } from '../utils/pathfinding'
import { hasLineOfSight } from '../utils/los'
import { dist, roundTile, tileEquals } from '../utils/iso'
import type { MonsterCfg, MonsterRuntime, Vec2 } from '../types/game'

/**
 * Monster "Caught" state machine: PATROL → (line of sight) → CHASE → either
 * catches the player (caught event) or loses them (hidden / out of range)
 * → RETURN to the patrol route → PATROL. All movement runs on A* paths.
 */

export interface MonsterEvents {
  caught: boolean
  startedChase: boolean
  endedChase: boolean
}

const CATCH_RADIUS = 0.75
const CHASE_REPLAN_SECONDS = 0.4
const LOSE_TARGET_SECONDS = 2.2

/** Advance an entity along its tile path. Mutates pos and path. */
export function moveAlong(pos: Vec2, path: Vec2[], speed: number, dt: number): void {
  let budget = speed * dt
  while (budget > 0 && path.length > 0) {
    const target = path[0]
    const d = dist(pos, target)
    if (d <= budget) {
      pos.x = target.x
      pos.y = target.y
      path.shift()
      budget -= d
    } else {
      pos.x += ((target.x - pos.x) / d) * budget
      pos.y += ((target.y - pos.y) / d) * budget
      budget = 0
    }
  }
}

/** One AI tick. Mutates pos and rt (pre-cloned by the caller); returns events. */
export function updateMonster(
  pos: Vec2,
  rt: MonsterRuntime,
  cfg: MonsterCfg,
  grid: number[][],
  playerPos: Vec2,
  playerHidden: boolean,
  dt: number,
): MonsterEvents {
  const events: MonsterEvents = { caught: false, startedChase: false, endedChase: false }
  const monsterTile = roundTile(pos)
  const playerTile = roundTile(playerPos)
  const distToPlayer = dist(pos, playerPos)
  const seesPlayer =
    !playerHidden &&
    distToPlayer <= cfg.sight_range &&
    hasLineOfSight(grid, monsterTile, playerTile)

  switch (rt.mode) {
    case 'PATROL': {
      if (seesPlayer) {
        rt.mode = 'CHASE'
        rt.path = []
        rt.replanIn = 0
        rt.loseIn = LOSE_TARGET_SECONDS
        events.startedChase = true
        break
      }
      if (rt.path.length === 0) {
        if (tileEquals(monsterTile, cfg.patrol[rt.patrolIndex])) {
          rt.patrolIndex = (rt.patrolIndex + 1) % cfg.patrol.length
        }
        rt.path = findPath(grid, monsterTile, cfg.patrol[rt.patrolIndex])
      }
      moveAlong(pos, rt.path, cfg.speed, dt)
      break
    }

    case 'CHASE': {
      if (distToPlayer <= CATCH_RADIUS && !playerHidden) {
        events.caught = true
        break
      }
      rt.replanIn -= dt
      if (rt.replanIn <= 0) {
        rt.path = findPath(grid, monsterTile, playerTile)
        rt.replanIn = CHASE_REPLAN_SECONDS
      }
      moveAlong(pos, rt.path, cfg.chase_speed, dt)
      if (seesPlayer) {
        rt.loseIn = LOSE_TARGET_SECONDS
      } else {
        rt.loseIn -= dt
        if (rt.loseIn <= 0) {
          rt.mode = 'RETURN'
          rt.path = findPath(grid, monsterTile, cfg.patrol[rt.patrolIndex])
          events.endedChase = true
        }
      }
      break
    }

    case 'RETURN': {
      if (seesPlayer) {
        rt.mode = 'CHASE'
        rt.path = []
        rt.replanIn = 0
        rt.loseIn = LOSE_TARGET_SECONDS
        events.startedChase = true
        break
      }
      if (rt.path.length === 0) {
        if (tileEquals(monsterTile, cfg.patrol[rt.patrolIndex])) {
          rt.mode = 'PATROL'
        } else {
          rt.path = findPath(grid, monsterTile, cfg.patrol[rt.patrolIndex])
        }
      }
      moveAlong(pos, rt.path, cfg.speed, dt)
      break
    }
  }
  return events
}

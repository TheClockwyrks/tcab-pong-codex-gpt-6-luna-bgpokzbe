import type { Game, InitApi, RenderApi } from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  OBSTACLE_CENTERS,
  OBSTACLES,
  PADDLE_HALF,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  SPIN_CLAMP,
  SPEED_CAP,
  SPEED_MULT,
  TITLE_ITEMS,
  TITLE_TEXT,
  PAUSE_ITEMS,
  MATCHOVER_ITEMS,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";
export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";
export type Mode = "solo" | "versus";
export type Side = "left" | "right";
export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}
export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}
export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}
export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}
export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
}
export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";
  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;
  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;
  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];
  readonly simTime: number;
  readonly muted: boolean;
}
export interface CaromSnapshot {
  version: number;
  screen: Screen;
  mode: Mode;
  menuIndex: number;
  titleIndex: number;
  resumeScreen: "countdown" | "playing";
  score: { p1: number; p2: number };
  winner: Side | null;
  muted: boolean;
  paddles: {
    left: { cy: number; vy: number; drivenVy: number; driven: boolean };
    right: { cy: number; vy: number; drivenVy: number; driven: boolean };
  };
  ai: { tracking: boolean; movement: boolean };
  receiver: Side;
  ball:
    | (Omit<BallState, "trail"> & {
        speed: number;
        trail: readonly TrailSample[];
      })
    | null;
  obstacles: readonly ObstacleState[];
  simTime: number;
}
export interface CaromDebugApi {
  version: number;
  clearWorld(s: DeepReadonly<CaromState>): CaromState;
  spawnBall(s: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(s: DeepReadonly<CaromState>, index: number): CaromState;
  reset(s: DeepReadonly<CaromState>): CaromState;
  reconcile(s: DeepReadonly<CaromState>): CaromState;
  setScreen(s: DeepReadonly<CaromState>, v: Screen): CaromState;
  setMode(s: DeepReadonly<CaromState>, v: Mode): CaromState;
  setMenuIndex(s: DeepReadonly<CaromState>, v: number): CaromState;
  setTitleIndex(s: DeepReadonly<CaromState>, v: number): CaromState;
  setResumeScreen(
    s: DeepReadonly<CaromState>,
    v: "countdown" | "playing",
  ): CaromState;
  setScore(s: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(s: DeepReadonly<CaromState>, v: Side | null): CaromState;
  setReceiver(s: DeepReadonly<CaromState>, v: Side): CaromState;
  setPaddleCy(s: DeepReadonly<CaromState>, side: Side, v: number): CaromState;
  setPaddleVy(s: DeepReadonly<CaromState>, side: Side, v: number): CaromState;
  setPaddleDriven(
    s: DeepReadonly<CaromState>,
    side: Side,
    v: boolean,
  ): CaromState;
  setBallPosition(
    s: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    s: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(s: DeepReadonly<CaromState>, v: number): CaromState;
  setBallHeld(s: DeepReadonly<CaromState>, v: boolean): CaromState;
  setBallHoldTimer(s: DeepReadonly<CaromState>, v: number): CaromState;
  setBallServeSign(s: DeepReadonly<CaromState>, v: 1 | -1): CaromState;
  drawBallServeSign(s: DeepReadonly<CaromState>): CaromState;
  setAiTracking(s: DeepReadonly<CaromState>, v: boolean): CaromState;
  setAiMovement(s: DeepReadonly<CaromState>, v: boolean): CaromState;
  setMuted(s: DeepReadonly<CaromState>, v: boolean): CaromState;
  snapshot(s: DeepReadonly<CaromState>): CaromSnapshot;
  menuItemRect(
    s: DeepReadonly<CaromState>,
    index: number,
  ): { x: number; y: number; w: number; h: number } | null;
}
export const BACKGROUND = "#080d18";
const initial = (muted = false, titleIndex = 0): CaromState => ({
  screen: "title",
  mode: "solo",
  menuIndex: titleIndex,
  titleIndex,
  resumeScreen: "playing",
  score: { p1: 0, p2: 0 },
  winner: null,
  paddles: {
    left: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
    right: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
  },
  ai: { tracking: true, movement: true },
  receiver: "left",
  ball: {
    x: FIELD_CX,
    y: FIELD_CY,
    vx: 0,
    vy: 0,
    spin: 0,
    held: true,
    holdTimer: HOLD_TIME,
    serveSign: Math.random() < 0.5 ? -1 : 1,
    trail: [],
  },
  obstacles: OBSTACLE_CENTERS.map((p, index) => ({ index, cx: p.x, cy: p.y })),
  simTime: 0,
  muted,
});
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const menuItems = (s: DeepReadonly<CaromState>) =>
  s.screen === "title"
    ? TITLE_ITEMS
    : s.screen === "howto"
      ? ["BACK"]
      : s.screen === "paused"
        ? PAUSE_ITEMS
        : s.screen === "matchover"
          ? MATCHOVER_ITEMS
          : [];
const rect = (i: number) => ({ x: 440, y: 390 + i * 70, w: 400, h: 54 });
function debugApi(): CaromDebugApi {
  const ball = (s: DeepReadonly<CaromState>) => {
    if (!s.ball) throw Error("Carom: no ball");
    return s.ball;
  };
  const patchBall = (s: DeepReadonly<CaromState>, b: BallState) => ({
    ...s,
    ball: b,
  });

  const ops: CaromDebugApi = {
    version: CAROM_DEBUG_VERSION,
    clearWorld: (s) => ({ ...s, ball: null, obstacles: [] }),
    spawnBall: (s) => ({
      ...s,
      ball: {
        x: FIELD_CX,
        y: FIELD_CY,
        vx: 0,
        vy: 0,
        spin: 0,
        held: true,
        holdTimer: HOLD_TIME,
        serveSign: Math.random() < 0.5 ? -1 : 1,
        trail: [],
      },
    }),
    spawnObstacle: (s, i) => {
      if (i < 0 || i > 1 || !Number.isInteger(i))
        throw Error("Carom: invalid obstacle");
      return {
        ...s,
        obstacles: [
          ...s.obstacles.filter((o) => o.index !== i),
          { index: i, cx: OBSTACLE_CENTERS[i].x, cy: OBSTACLE_CENTERS[i].y },
        ].sort((a, b) => a.index - b.index),
      };
    },
    reset: (s) => ({ ...initial(s.muted, s.titleIndex), simTime: 0 }),
    reconcile: (s) => ({ ...s }),
    setScreen: (s, v) => ({ ...s, screen: v }),
    setMode: (s, v) => ({ ...s, mode: v }),
    setMenuIndex: (s, v) => ({ ...s, menuIndex: v }),
    setTitleIndex: (s, v) => ({ ...s, titleIndex: v }),
    setResumeScreen: (s, v) => ({ ...s, resumeScreen: v }),
    setScore: (s, p1, p2) => ({ ...s, score: { p1, p2 } }),
    setWinner: (s, v) => ({ ...s, winner: v }),
    setReceiver: (s, v) => ({ ...s, receiver: v }),
    setPaddleCy: (s, side, v) => ({
      ...s,
      paddles: { ...s.paddles, [side]: { ...s.paddles[side], cy: v } },
    }),
    setPaddleVy: (s, side, v) => ({
      ...s,
      paddles: { ...s.paddles, [side]: { ...s.paddles[side], drivenVy: v } },
    }),
    setPaddleDriven: (s, side, v) => ({
      ...s,
      paddles: { ...s.paddles, [side]: { ...s.paddles[side], driven: v } },
    }),
    setBallPosition: (s, x, y) => patchBall(s, { ...ball(s), x, y }),
    setBallVelocity: (s, vx, vy) => patchBall(s, { ...ball(s), vx, vy }),
    setBallSpin: (s, spin) => patchBall(s, { ...ball(s), spin }),
    setBallHeld: (s, held) => patchBall(s, { ...ball(s), held }),
    setBallHoldTimer: (s, holdTimer) => patchBall(s, { ...ball(s), holdTimer }),
    setBallServeSign: (s, serveSign) => patchBall(s, { ...ball(s), serveSign }),
    drawBallServeSign: (s) =>
      patchBall(s, { ...ball(s), serveSign: Math.random() < 0.5 ? -1 : 1 }),
    setAiTracking: (s, v) => ({ ...s, ai: { ...s.ai, tracking: v } }),
    setAiMovement: (s, v) => ({ ...s, ai: { ...s.ai, movement: v } }),
    setMuted: (s, v) => ({ ...s, muted: v }),
    snapshot: (s) => ({
      version: CAROM_DEBUG_VERSION,
      ...s,
      ball: s.ball && {
        ...s.ball,
        trail: s.ball.trail.map((sample) => ({ ...sample })),
        speed: Math.hypot(s.ball.vx, s.ball.vy),
      },
      obstacles: s.obstacles.map((o) => ({ ...o })),
    }),
    menuItemRect: (s, i) =>
      i >= 0 && i < menuItems(s).length ? rect(i) : null,
  };
  return ops;
}
function start(s: CaromState, mode = s.mode): CaromState {
  const n = initial(s.muted, s.titleIndex);
  return {
    ...n,
    screen: "countdown",
    mode,
    menuIndex: 0,
    titleIndex: s.titleIndex,
    simTime: s.simTime,
    paddles: {
      left: {
        ...n.paddles.left,
        driven: s.paddles.left.driven,
        drivenVy: s.paddles.left.drivenVy,
      },
      right: {
        ...n.paddles.right,
        driven: s.paddles.right.driven,
        drivenVy: s.paddles.right.drivenVy,
      },
    },
  };
}
function toTitle(s: CaromState): CaromState {
  return {
    ...initial(s.muted, s.titleIndex),
    simTime: s.simTime,
    menuIndex: s.titleIndex,
    titleIndex: s.titleIndex,
  };
}
function movePaddle(
  s: CaromState,
  side: Side,
  axis: number,
  dt: number,
): PaddleState {
  const p = s.paddles[side];
  let vy = p.driven ? p.drivenVy : axis * PADDLE_SPEED;
  if (side === "right" && s.mode === "solo" && !p.driven) {
    if (!s.ai.movement) vy = 0;
    else {
      let target = AI_HOME_Y,
        zone = AI_HOME_DEADZONE;
      if (s.ai.tracking && s.screen === "playing" && s.ball && s.ball.vx > 0) {
        target = s.ball.y - s.ball.vy * AI_REACT;
        zone = AI_DEADZONE;
      }
      const d = target - p.cy;
      vy =
        Math.abs(d) <= zone
          ? 0
          : Math.sign(d) * Math.min(AI_SPEED, Math.abs(d) / Math.max(dt, 1e-9));
    }
  }
  const cy = clamp(p.cy + vy * dt, PADDLE_MIN_CY, PADDLE_MAX_CY);
  if (dt > 0) vy = (cy - p.cy) / dt;
  return { ...p, cy, vy };
}
export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>) {
    for (const name of ACTIONS)
      api.input.register(name, { keys: [...BINDINGS[name]] });
    api.audio.define(CUES.paddleHit, {
      wave: "square",
      freq: 560,
      freqTo: 360,
      durationMs: 55,
    });
    api.audio.define(CUES.wallBounce, {
      freq: 320,
      freqTo: 220,
      durationMs: 45,
    });
    api.audio.define(CUES.obstacleBounce, {
      wave: "triangle",
      freq: 440,
      freqTo: 270,
      durationMs: 70,
    });
    api.audio.define(CUES.score, {
      wave: "sine",
      freq: 760,
      freqTo: 440,
      durationMs: 180,
    });
    for (const [n, f] of Object.entries({
      screen: (s: DeepReadonly<CaromState>) => s.screen,
      mode: (s: DeepReadonly<CaromState>) => s.mode,
      score: (s: DeepReadonly<CaromState>) => `${s.score.p1}-${s.score.p2}`,
      ball: (s: DeepReadonly<CaromState>) =>
        s.ball ? `${s.ball.x.toFixed(0)},${s.ball.y.toFixed(0)}` : "absent",
      velocity: (s: DeepReadonly<CaromState>) =>
        s.ball ? `${s.ball.vx.toFixed(0)},${s.ball.vy.toFixed(0)}` : "—",
      speed: (s: DeepReadonly<CaromState>) =>
        s.ball ? Math.hypot(s.ball.vx, s.ball.vy).toFixed(0) : "—",
      spin: (s: DeepReadonly<CaromState>) => s.ball?.spin.toFixed(0) ?? "—",
      left: (s: DeepReadonly<CaromState>) =>
        `${s.paddles.left.cy.toFixed(0)} / ${s.paddles.left.vy.toFixed(0)}`,
      right: (s: DeepReadonly<CaromState>) =>
        `${s.paddles.right.cy.toFixed(0)} / ${s.paddles.right.vy.toFixed(0)}`,
    }))
      api.diagnostics.register(n, f);
    return [initial(), debugApi()];
  },
  update(state, api, dt) {
    let s = {
      ...state,
      simTime: state.simTime + dt,
      muted: api.audio.muted(),
    } as CaromState;
    const inp = api.input;
    if (inp.pressed("mute")) {
      api.audio.setMuted(!api.audio.muted());
      s = { ...s, muted: api.audio.muted() };
    }
    const count = menuItems(s).length;
    const p1Up = inp.pressed("p1-up");
    const p2Up = inp.pressed("p2-up");
    const p1Down = inp.pressed("p1-down");
    const p2Down = inp.pressed("p2-down");
    const up = p1Up || p2Up;
    const down = p1Down || p2Down;
    const confirm = inp.pressed("confirm"),
      back = inp.pressed("back"),
      pause = inp.pressed("pause");
    if (s.screen === "title") {
      if (up || down)
        s = {
          ...s,
          menuIndex:
            (s.menuIndex + (up ? -1 : 1) + TITLE_ITEMS.length) %
            TITLE_ITEMS.length,
        };
      else if (confirm) {
        s = { ...s, titleIndex: s.menuIndex };
        s =
          s.menuIndex === 0
            ? start(s, "solo")
            : s.menuIndex === 1
              ? start(s, "versus")
              : { ...s, screen: "howto", menuIndex: 0 };
      }
    } else if (s.screen === "howto") {
      if (confirm || back) s = { ...toTitle(s), simTime: s.simTime };
    } else if (s.screen === "paused") {
      if (pause || back) s = { ...s, screen: s.resumeScreen };
      else if (up || down)
        s = {
          ...s,
          menuIndex:
            (s.menuIndex + (up ? -1 : 1) + PAUSE_ITEMS.length) %
            PAUSE_ITEMS.length,
        };
      else if (confirm)
        s =
          s.menuIndex === 0
            ? { ...s, screen: s.resumeScreen }
            : s.menuIndex === 1
              ? start(s)
              : toTitle(s);
    } else if (s.screen === "matchover") {
      if (up || down)
        s = {
          ...s,
          menuIndex:
            (s.menuIndex + (up ? -1 : 1) + MATCHOVER_ITEMS.length) %
            MATCHOVER_ITEMS.length,
        };
      else if (confirm) s = s.menuIndex === 0 ? start(s) : toTitle(s);
      else if (back) s = toTitle(s);
    } else if ((s.screen === "playing" || s.screen === "countdown") && pause) {
      s = { ...s, resumeScreen: s.screen, screen: "paused", menuIndex: 0 };
    }
    // Pointer menus; regions match menuItemRect.
    if (count && ["title", "howto", "paused", "matchover"].includes(s.screen)) {
      const samples = inp.pointerSamples();
      let pressedAt: { x: number; y: number } | null = null;
      for (const q of samples) {
        const i = menuItems(s).findIndex(
          (_, j) =>
            q.x >= rect(j).x &&
            q.x <= rect(j).x + rect(j).w &&
            q.y >= rect(j).y &&
            q.y <= rect(j).y + rect(j).h,
        );
        if (q.type === "down" && q.primary)
          pressedAt = i >= 0 ? { x: q.x, y: q.y } : null;
        if (q.type === "move" && i >= 0) s = { ...s, menuIndex: i };
        if (q.type === "up" && q.primary && pressedAt) {
          const j = menuItems(s).findIndex(
            (_, k) =>
              pressedAt!.x >= rect(k).x &&
              pressedAt!.x <= rect(k).x + rect(k).w &&
              pressedAt!.y >= rect(k).y &&
              pressedAt!.y <= rect(k).y + rect(k).h,
          );
          if (j === i && i >= 0) {
            s = { ...s, menuIndex: i };
            if (!confirm) s = activate(s);
          }
        }
      }
    }
    function activate(st: CaromState): CaromState {
      if (st.screen === "title") {
        st = { ...st, titleIndex: st.menuIndex };
        return st.menuIndex === 0
          ? start(st, "solo")
          : st.menuIndex === 1
            ? start(st, "versus")
            : { ...st, screen: "howto", menuIndex: 0 };
      }
      if (st.screen === "howto") return toTitle(st);
      if (st.screen === "paused")
        return st.menuIndex === 0
          ? { ...st, screen: st.resumeScreen }
          : st.menuIndex === 1
            ? start(st)
            : toTitle(st);
      if (st.screen === "matchover")
        return st.menuIndex === 0 ? start(st) : toTitle(st);
      return st;
    }
    if (s.screen === "playing" || s.screen === "countdown") {
      const a1 =
        (s.mode === "solo"
          ? inp.value("p1-down") + inp.value("p2-down")
          : inp.value("p1-down")) -
        (s.mode === "solo"
          ? inp.value("p1-up") + inp.value("p2-up")
          : inp.value("p1-up"));
      const a2 = inp.value("p2-down") - inp.value("p2-up");
      const left = movePaddle(s, "left", a1, dt);
      s = { ...s, paddles: { ...s.paddles, left } };
      const right = movePaddle(s, "right", a2, dt);
      s = { ...s, paddles: { ...s.paddles, right } };
    }
    let b = s.ball;
    if (b && (s.screen === "playing" || s.screen === "countdown")) {
      if (s.screen === "countdown" && b.held) {
        const t = Math.max(0, b.holdTimer - dt);
        if (t === 0) {
          const dir = s.receiver === "left" ? -1 : 1;
          b = {
            ...b,
            held: false,
            holdTimer: 0,
            vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
            vy: b.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
            trail: [],
          };
          s = { ...s, screen: "playing" };
        } else b = { ...b, holdTimer: t };
      }
      if (s.screen === "playing" && !b.held) {
        let speed = Math.hypot(b.vx, b.vy);
        const n = Math.max(1, Math.ceil((speed * dt) / MAX_SUBSTEP)),
          h = dt / n;
        let vx = b.vx,
          vy = b.vy,
          spin = b.spin,
          x = b.x,
          y = b.y;
        let wall = false,
          paddle = false,
          obstacle = false;
        for (let step = 0; step < n; step++) {
          speed = Math.hypot(vx, vy);
          if (speed > 0) {
            const a = (spin / speed) * h,
              c = Math.cos(a),
              ss = Math.sin(a);
            [vx, vy] = [vx * c - vy * ss, vx * ss + vy * c];
          }
          spin *= Math.pow(0.5, h / SPIN_HALFLIFE);
          x += vx * h;
          y += vy * h;
          if (y - BALL_R < 0 && vy < 0) {
            y = BALL_R;
            vy = -vy;
            wall = true;
          } else if (y + BALL_R > FIELD_H && vy > 0) {
            y = FIELD_H - BALL_R;
            vy = -vy;
            wall = true;
          }
          for (const side of ["left", "right"] as const) {
            const p = s.paddles[side],
              x0 = side === "left" ? P1_X0 : P2_X0,
              x1 = side === "left" ? P1_X1 : P2_X1,
              y0 = p.cy - PADDLE_HALF,
              y1 = p.cy + PADDLE_HALF;
            if (
              x > x0 - BALL_R &&
              x < x1 + BALL_R &&
              y > y0 - BALL_R &&
              y < y1 + BALL_R
            ) {
              const ds = [
                  x - (x0 - BALL_R),
                  x1 + BALL_R - x,
                  y - (y0 - BALL_R),
                  y1 + BALL_R - y,
                ],
                m = Math.min(...ds),
                face = ds.indexOf(m);
              if (face < 2) {
                const off = clamp((y - p.cy) / PADDLE_HALF, -1, 1),
                  theta = off * MAX_BOUNCE_ANGLE,
                  sp = Math.min(Math.hypot(vx, vy) * SPEED_MULT, SPEED_CAP),
                  dir = side === "left" ? 1 : -1;
                vx = dir * sp * Math.cos(theta);
                vy = sp * Math.sin(theta);
                spin = clamp(
                  spin + p.vy * SPIN_FROM_PADDLE,
                  -SPIN_CLAMP,
                  SPIN_CLAMP,
                );
                x = side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R;
                paddle = true;
              } else {
                if (face === 2) {
                  y = y0 - BALL_R;
                  if (vy > 0) vy = -vy;
                } else {
                  y = y1 + BALL_R;
                  if (vy < 0) vy = -vy;
                }
                wall = true;
              }
            }
          }
          for (const o of s.obstacles) {
            const r = OBSTACLES[o.index];
            if (
              x > r.x0 - BALL_R &&
              x < r.x1 + BALL_R &&
              y > r.y0 - BALL_R &&
              y < r.y1 + BALL_R
            ) {
              const ds = [
                  x - (r.x0 - BALL_R),
                  r.x1 + BALL_R - x,
                  y - (r.y0 - BALL_R),
                  r.y1 + BALL_R - y,
                ],
                face = ds.indexOf(Math.min(...ds));
              if (face === 0) {
                x = r.x0 - BALL_R;
                if (vx > 0) vx = -vx;
              } else if (face === 1) {
                x = r.x1 + BALL_R;
                if (vx < 0) vx = -vx;
              } else if (face === 2) {
                y = r.y0 - BALL_R;
                if (vy > 0) vy = -vy;
              } else {
                y = r.y1 + BALL_R;
                if (vy < 0) vy = -vy;
              }
              obstacle = true;
            }
          }
        }
        b = { ...b, x, y, vx, vy, spin };
        if (paddle) api.audio.play(CUES.paddleHit);
        if (wall) api.audio.play(CUES.wallBounce);
        if (obstacle) api.audio.play(CUES.obstacleBounce);
        let score = s.score;
        if (x - BALL_R > FIELD_W) score = { ...score, p1: score.p1 + 1 };
        else if (x + BALL_R < 0) score = { ...score, p2: score.p2 + 1 };
        if (score !== s.score) {
          api.audio.play(CUES.score);
          const scorer = score.p1 > s.score.p1 ? "left" : "right";
          if (
            (scorer === "left" &&
              score.p1 >= WIN_SCORE &&
              score.p1 - score.p2 >= WIN_LEAD) ||
            (scorer === "right" &&
              score.p2 >= WIN_SCORE &&
              score.p2 - score.p1 >= WIN_LEAD)
          ) {
            s = {
              ...s,
              score,
              winner: scorer,
              screen: "matchover",
              menuIndex: 0,
            };
          } else {
            s = { ...s, score, receiver: scorer === "left" ? "right" : "left" };
            b = {
              x: FIELD_CX,
              y: FIELD_CY,
              vx: 0,
              vy: 0,
              spin: 0,
              held: true,
              holdTimer: HOLD_TIME,
              serveSign: Math.random() < 0.5 ? -1 : 1,
              trail: [],
            };
            s = { ...s, screen: "countdown" };
          }
        }
      }
      const trail = [...b.trail, { x: b.x, y: b.y, t: s.simTime }].filter(
        (q) => s.simTime - q.t <= TRAIL_TIME,
      );
      b = { ...b, trail };
      s = { ...s, ball: b };
    }
    return s;
  },
  render(s, api: RenderApi) {
    const c = api.ctx;
    c.fillStyle = BACKGROUND;
    c.fillRect(0, 0, FIELD_W, FIELD_H);
    c.fillStyle = "#111d2c";
    for (let y = 24; y < FIELD_H; y += 32)
      for (let x = 24; x < FIELD_W; x += 32) {
        c.beginPath();
        c.arc(x, y, 1, 0, Math.PI * 2);
        c.fill();
      }
    c.setLineDash([12, 14]);
    c.strokeStyle = "#344356";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(FIELD_CX, 30);
    c.lineTo(FIELD_CX, FIELD_H - 30);
    c.stroke();
    c.setLineDash([]);
    for (const o of s.obstacles) {
      c.fillStyle = "#f6a94a";
      c.shadowColor = "#f6a94a";
      c.shadowBlur = 18;
      c.beginPath();
      c.roundRect(o.cx - 10, o.cy - 70, 20, 140, 10);
      c.fill();
    }
    c.shadowBlur = 0;
    const drawP = (side: Side) => {
      const p = s.paddles[side];
      c.fillStyle = side === "left" ? "#48e4d3" : "#ff5f85";
      c.shadowColor = c.fillStyle;
      c.shadowBlur = 20;
      c.beginPath();
      c.roundRect(
        side === "left" ? P1_X0 : P2_X0,
        p.cy - PADDLE_HALF,
        16,
        110,
        8,
      );
      c.fill();
    };
    drawP("left");
    drawP("right");
    if (s.ball) {
      const b = s.ball;
      c.lineCap = "round";
      for (let i = 1; i < b.trail.length; i++) {
        const q = b.trail[i],
          prev = b.trail[i - 1];
        c.strokeStyle = `rgba(111,205,255,${(i / b.trail.length) * 0.45})`;
        c.lineWidth = 2 + (i / b.trail.length) * 5;
        c.beginPath();
        c.moveTo(prev.x, prev.y);
        c.lineTo(q.x, q.y);
        c.stroke();
      }
      c.fillStyle = "#f5fbff";
      c.shadowColor = "#80dfff";
      c.shadowBlur = 22;
      c.beginPath();
      c.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
      c.fill();
      c.shadowBlur = 0;
    }
    if (
      s.screen === "playing" ||
      s.screen === "countdown" ||
      s.screen === "paused" ||
      s.screen === "matchover"
    ) {
      c.textAlign = "center";
      c.fillStyle = "#eaf2fc";
      c.font = "700 54px system-ui";
      c.fillText(String(s.score.p1), FIELD_CX - 100, 84);
      c.fillText(String(s.score.p2), FIELD_CX + 100, 84);
      c.font = "600 14px system-ui";
      c.fillStyle = "#8190a5";
      c.fillText(
        s.mode === "solo" ? "SOLO • VS CPU" : "LOCAL VERSUS",
        FIELD_CX,
        112,
      );
    }
    if (
      s.screen === "title" ||
      s.screen === "howto" ||
      s.screen === "paused" ||
      s.screen === "matchover"
    ) {
      c.fillStyle = "rgba(5,10,18,.72)";
      c.fillRect(0, 0, FIELD_W, FIELD_H);
      c.textAlign = "center";
      c.fillStyle = "#f4f8ff";
      c.font = "900 88px system-ui";
      c.fillText(
        s.screen === "title"
          ? TITLE_TEXT
          : s.screen === "howto"
            ? "HOW TO PLAY"
            : s.screen === "paused"
              ? "PAUSED"
              : `${s.winner === "left" ? "PLAYER 1" : "PLAYER 2"} WINS`,
        FIELD_CX,
        245,
      );
      const items = menuItems(s);
      if (s.screen === "howto") {
        c.font = "500 21px system-ui";
        c.fillStyle = "#bcc9d9";
        c.fillText("W / S moves left • ↑ / ↓ moves right", FIELD_CX, 330);
        c.fillText(
          "Move as you strike to add spin. Bank shots off the amber gates.",
          FIELD_CX,
          368,
        );
        c.fillText("P or Esc pauses • M toggles sound", FIELD_CX, 404);
      }
      for (let i = 0; i < items.length; i++) {
        const r = rect(i);
        c.fillStyle = i === s.menuIndex ? "#193a50" : "rgba(255,255,255,.04)";
        c.strokeStyle = i === s.menuIndex ? "#48e4d3" : "#344356";
        c.lineWidth = 2;
        c.beginPath();
        c.roundRect(r.x, r.y, r.w, r.h, 12);
        c.fill();
        c.stroke();
        c.fillStyle = i === s.menuIndex ? "#f5ffff" : "#aab8c8";
        c.font = "700 21px system-ui";
        c.fillText(items[i], FIELD_CX, r.y + 35);
      }
      if (s.screen === "matchover") {
        c.font = "700 24px system-ui";
        c.fillStyle = "#bfcddd";
        c.fillText(`${s.score.p1}  —  ${s.score.p2}`, FIELD_CX, 300);
      }
      if (s.screen === "title") {
        c.font = "500 16px system-ui";
        c.fillStyle = "#8fa1b5";
        c.fillText("A duel of timing, spin, and clever banks", FIELD_CX, 298);
      }
    }
    if (s.screen === "countdown") {
      c.fillStyle = "#ecf8ff";
      c.textAlign = "center";
      c.font = "800 26px system-ui";
      c.fillText("GET READY", FIELD_CX, FIELD_CY - 42);
    }
    if (s.screen === "playing") {
      c.fillStyle = "#a7c8dc";
      c.textAlign = "center";
      c.font = "500 14px system-ui";
      c.fillText("W/S", 32, s.paddles.left.cy);
      if (s.mode === "versus") c.fillText("↑/↓", 1248, s.paddles.right.cy);
    }
  },
};

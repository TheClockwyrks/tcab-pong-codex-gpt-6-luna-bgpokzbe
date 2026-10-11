import { describe, expect, it } from "vitest";
import type { DeepReadonly } from "ts-essentials";
import type { CaromDebugApi, CaromState } from "./game";
import { game } from "./game";

function harness() {
  const definitions: Record<string, unknown> = {};
  const api = {
    input: {
      register() {},
      value: () => 0,
      pressed: () => false,
      pointerSamples: () => [],
    },
    audio: {
      define: (name: string, cue: unknown) => (definitions[name] = cue),
      muted: () => false,
      setMuted() {},
      play() {},
    },
    diagnostics: { register() {} },
  } as never;
  const [initial, debug] = game.initialize(api) as [CaromState, CaromDebugApi];
  const update = (state: CaromState, dt: number) =>
    game.update(
      state as DeepReadonly<CaromState>,
      {
        input: {
          value: () => 0,
          pressed: () => false,
          pointerSamples: () => [],
        },
        audio: { muted: () => false, setMuted() {}, play() {} },
      } as never,
      dt,
    );
  return { initial, debug, update, definitions };
}

describe("Carom simulation", () => {
  it("initializes the full title world and four sound cues", () => {
    const { initial, debug, definitions } = harness();
    expect(initial.screen).toBe("title");
    expect(initial.ball?.held).toBe(true);
    expect(initial.obstacles).toHaveLength(2);
    expect(Object.keys(definitions)).toHaveLength(4);
    expect(debug.snapshot(initial).version).toBe(1);
  });

  it("serves after the countdown and advances in logical seconds", () => {
    const { initial, debug, update } = harness();
    let s = debug.setScreen(initial, "countdown");
    s = update(s, 0.5);
    expect(s.ball?.held).toBe(true);
    expect(s.ball?.holdTimer).toBeCloseTo(0.5);
    s = update(s, 0.5);
    expect(s.screen).toBe("playing");
    expect(s.ball?.held).toBe(false);
    expect(Math.hypot(s.ball!.vx, s.ball!.vy)).toBeCloseTo(520);
  });

  it("integrates a driven paddle and clamps it to the field", () => {
    const { initial, debug, update } = harness();
    let s = debug.setScreen(initial, "countdown");
    s = debug.setPaddleDriven(s, "left", true);
    s = debug.setPaddleVy(s, "left", -720);
    s = update(s, 1);
    expect(s.paddles.left.cy).toBe(55);
    expect(s.paddles.left.vy).toBe(-305);
  });

  it("poses and clears the world without mutating its input", () => {
    const { initial, debug } = harness();
    const cleared = debug.clearWorld(initial);
    expect(initial.ball).not.toBeNull();
    expect(cleared.ball).toBeNull();
    expect(cleared.obstacles).toEqual([]);
    expect(() => debug.setBallSpin(cleared, 2)).toThrow("no ball");
  });
});

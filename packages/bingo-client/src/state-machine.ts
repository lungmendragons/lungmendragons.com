type StateSet = Record<string, any>;
type EventSet = Record<string, any>;

type Opt<A> = A extends [ type: infer K, data: infer D ] ?
  D extends undefined ? [ type: K, data?: D ] : [ type: K, data: D ] : never;

type TriOpt<A> = A extends [ type: infer K, data: infer D, hooks: infer H ] ?
  D extends undefined ? [ type: K, data?: D, hooks?: H ] : [ type: K, data: D, hooks?: H ] : never;

export interface EventCtx<S extends StateSet, E extends EventSet> {
  next: <K extends Key<S>>(...params: Opt<[type: K, data: S[K]]>) => void;
  event: EventCall<E>;
  hooks: MachineInstance<S, E>["hooks"];
}

type Combine<S extends Record<string, any>> =
  keyof S extends infer K extends Key<S> ? K extends any ? { type: K; data: S[K] } :
    never : never;

function combine<
  K extends keyof V,
  V extends Record<string, object | undefined>,
>(type: K, data?: V[K]): Combine<V> {
  return { type, data } as unknown as Combine<V>;
}

type MachineCfg<C extends any[], S extends StateSet, E extends EventSet> = {
  initial: (...args: C) => Combine<S>;
  state: {
    [SK in keyof S]?: {
      [EK in keyof E]?: (state: S[SK], event: E[EK], ctx: EventCtx<S, E>) => Promise<void>;
    } /* & {
      enter?: (state: S[SK], prev: Combine<S>, ctx: EventCtx<S, E>) => Promise<void>;
      exit?: (state: S[SK], next: Combine<S>, ctx: EventCtx<S, E>) => Promise<void>;
      event?: (state: S[SK], event: Combine<E>, ctx: EventCtx<S, E>) => Promise<void>;
    } */;
  };
};

type EventCall<E extends EventSet> = <K extends Key<E>>(...params: Opt<[type: K, data: E[K]]>) => Promise<void>;

export interface MachineInstance<S extends StateSet, E extends EventSet> {
  state: Combine<S>;
  event: <K extends Key<E>>(...params: [
    ...TriOpt<[type: K, data: E[K], hooks: MachineInstance<S, E>["hooks"]]>,
  ]) => Promise<void>;
  tryGet: <K extends Key<S>>(...types: K[]) => S[K] | undefined;
  hooks: {
    afterEvent?: (eventProcessed: boolean, state: Combine<S>, event: Combine<E>) => void;
  };
  Infer: { state: S; event: E };
}

type Key<V> = string & keyof V;

export function stateMachine<
  C extends any[],
  S extends StateSet,
  E extends EventSet,
>(
  f: () => MachineCfg<C, S, E>,
): (...args: C) => MachineInstance<S, E> {
  const cfg = f();

  class StateMachine {
    constructor(...args: C) {
      this.state = cfg.initial(...args);
    }

    state: Combine<S>;

    hooks: MachineInstance<S, E>["hooks"] = {};

    next<K extends Key<S>>(type: K, data?: S[K]) {
      this.state = combine(type, data);
    }

    async event<K extends Key<E>>(type: K, data?: E[K], hooks?: MachineInstance<S, E>["hooks"]) {
      const ctx: EventCtx<S, E> = {
        next: (t, d?) => this.next(t, d),
        event: async (t, d?) => {
          const handler = cfg.state[this.state.type as string]?.[t];
          if (handler) {
            await handler(this.state.data as any, d as any, ctx);
            ctx.hooks.afterEvent?.(true, this.state, combine(t, d));
          } else {
            ctx.hooks.afterEvent?.(false, this.state, combine(t, d));
          }
        },
        hooks: {
          afterEvent: hooks?.afterEvent
            ? (p, s, e) => {
                hooks.afterEvent!(p, s, e);
                this.hooks.afterEvent?.(p, s, e);
              }
            : this.hooks.afterEvent,
        },
      };

      await (ctx.event as any)(type, data);
    };

    tryGet<K extends Key<S>>(...types: K[]) {
      if ((types as string[]).includes(this.state.type))
        return this.state.data as S[K];
      return undefined;
    }
  };

  return (...args: C) => {
    const out: Omit<MachineInstance<S, E>, "Infer"> = new StateMachine(...args);
    return out as MachineInstance<S, E>;
  };
}

export function states<
  S extends StateSet,
  E extends EventSet,
>(state: MachineCfg<any, S, E>["state"]): MachineCfg<any, S, E>["state"] {
  return state;
}

export function cfg<
  C extends any[],
  S extends StateSet,
  E extends EventSet,
>(data: MachineCfg<C, S, E>): MachineCfg<C, S, E> {
  return data;
}

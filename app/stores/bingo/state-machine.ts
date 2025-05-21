type StateSet = Record<string, any>;
type EventSet = Record<string, any>;

type Opt<A> = A extends [ type: infer K, data: infer D ] ?
  D extends undefined ? [ type: K, data?: D ] : [ type: K, data: D ] : never;

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

type MachineCfg<S extends StateSet, E extends EventSet> = {
  initial: () => Combine<S>;
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

interface MachineInstance<S extends StateSet, E extends EventSet> {
  state: Combine<S>;
  event: EventCall<E>;
  tryGet: <K extends Key<S>>(...types: K[]) => S[K] | undefined;
  hooks: {
    afterEvent?: () => void;
  };
  Infer: { state: S; event: E };
}

type Key<V> = string & keyof V;

export function stateMachine<
  S extends StateSet,
  E extends EventSet,
>(
  f: () => MachineCfg<S, E>,
): () => MachineInstance<S, E> {
  const cfg = f();

  class StateMachine {
    constructor() {
      this.state = cfg.initial();
    }

    state: Combine<S>;

    hooks: MachineInstance<S, E>["hooks"] = {};

    next<K extends Key<S>>(type: K, data?: S[K]) {
      this.state = combine(type, data);
    }

    async event<K extends Key<E>>(type: K, data?: E[K]) {
      const hook = cfg.state[this.state.type as string]?.[type];
      if (hook) {
        await hook(this.state.data as S[string], data as E[K], this);

        this.hooks.afterEvent?.();
      }
    };

    tryGet<K extends Key<S>>(...types: K[]) {
      if ((types as string[]).includes(this.state.type))
        return this.state.data as S[K];
      return undefined;
    }
  };

  return () => {
    const out: Omit<MachineInstance<S, E>, "Infer"> = new StateMachine();
    return out as MachineInstance<S, E>;
  };
}

export function cfg<
  S extends StateSet,
  E extends EventSet,
>(data: MachineCfg<S, E>): MachineCfg<S, E> {
  return data;
}

export interface MachineComposable<S extends StateSet, E extends EventSet> {
  state: Ref<Combine<S>>;
  event: MachineInstance<S, E>["event"];
  tryGet: MachineInstance<S, E>["tryGet"];
}

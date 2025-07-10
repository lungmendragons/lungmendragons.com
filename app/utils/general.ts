export function takeRef<T>(ref: Ref<T>, value: T): T {
  const out = ref.value;
  ref.value = value;
  return out;
}

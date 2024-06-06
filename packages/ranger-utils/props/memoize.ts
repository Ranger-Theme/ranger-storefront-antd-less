export const memoize = (fn: any) => {
  const cache = Object.create(null)

  return (arg: string) => {
    if (cache[arg] === undefined) cache[arg] = fn(arg)
    return cache[arg]
  }
}

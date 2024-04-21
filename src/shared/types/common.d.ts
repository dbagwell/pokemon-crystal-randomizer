type nullish = null | undefined

type Dictionary<Element> = { [key: string]: Element }

type KeyMapValue<Id extends string, Value> = { id: Id } & Value
type KeyMap<Key extends string, Value> = { [K in Key]: KeyMapValue<K, Value> }
type nullish = null | undefined

type Dictionary<Element> = { [key: string]: Element }

type IdMapValue<Id extends string, Value> = { id: Id } & Value
type IdMap<Key extends string, Value> = { [K in Key]: IdMapValue<K, Value> }
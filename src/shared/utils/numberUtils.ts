export const isNumber = (value: any): value is number => {
  return typeof value === "number"
}

export const numberFrom = (bytes: number[], bigEndian = false) => {
  const data = new DataView(new Uint8Array(bytes).buffer)
  try {
    return data.getUint32(0, !bigEndian)
  } catch {
    try {
      return data.getUint16(0, !bigEndian)
    } catch {
      return data.getUint8(0)
    }
  }
}

export const bytesFrom = (number: number, numberOfBytes: number, bigEndian: boolean = false) => {
  const dataView = new DataView(new ArrayBuffer(4))
  dataView.setUint32(0, number, !bigEndian)
  const offset = bigEndian ? 4 - numberOfBytes : 0
  return Array.from(new Uint8Array(dataView.buffer.slice(offset, offset + numberOfBytes)))
}

export const hexStringFrom = (bytes: number[], separator: string = ""): string => {
  return bytes.map((byte) => { return byte.toString(16).toUpperCase().padStart(2, "0") }).join(separator)
}
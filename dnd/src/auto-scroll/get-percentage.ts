interface Args {
  startOfRange: number
  endOfRange: number
  current: number
}

export const getPercentage = ({ startOfRange, endOfRange, current }: Args) => {
  const range = endOfRange - startOfRange

  if (range === 0) {
    return 0
  }

  const currentInRange = current - startOfRange
  const percentage = currentInRange / range

  return percentage
}

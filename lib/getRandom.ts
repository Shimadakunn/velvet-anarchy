export function getRandomNumber(
  min: number,
  max: number,
  withDecimals: boolean = false,
  step?: number
) {
  const randomValue = Math.random() * (max - min) + min;

  if (step !== undefined) {
    // Round to the nearest step
    return Math.round(randomValue / step) * step;
  }

  if (withDecimals) {
    return Math.floor(randomValue * 10) / 10;
  }
  return Math.floor(randomValue);
}

export function getRandomDateLastMonth() {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const randomTimestamp =
    oneMonthAgo.getTime() +
    Math.random() * (today.getTime() - oneMonthAgo.getTime());

  const randomDate = new Date(randomTimestamp);

  return randomDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

import { useWindowSize } from "usehooks-ts";

export function useIsMobile() {
  const { width } = useWindowSize();
  return width < 768;
}

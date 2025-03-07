import { useRef } from "react";

interface useScrollToElementProps {
  ref?: React.MutableRefObject<HTMLElement | null>;
  offset?: number;
  behavior?: ScrollBehavior;
}

const useScrollToElement = ({
  ref,
  offset = 0,
  behavior = "smooth",
}: useScrollToElementProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const scrollToElement = () => {
    if (ref && ref.current) {
      ref.current.style.scrollMarginTop = `${offset}px`;
      ref.current.scrollIntoView({ behavior });
    } else {
      if (elementRef.current) {
        elementRef.current.style.scrollMarginTop = `${offset}px`;
        elementRef.current.scrollIntoView({ behavior });
      }
    }
  };
  return { scrollToElement, elementRef };
};

export default useScrollToElement;

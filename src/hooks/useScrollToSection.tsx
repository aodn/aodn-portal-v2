import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToSectionOptions {
  sectionId: string;
  behavior?: ScrollBehavior;
}

const useScrollToSection = ({
  sectionId,
  behavior = "smooth",
}: ScrollToSectionOptions) => {
  const location = useLocation();
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get("section");

    if (section === sectionId && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior });
    }
  }, [location, sectionId, behavior]);

  return sectionRef;
};

export default useScrollToSection;

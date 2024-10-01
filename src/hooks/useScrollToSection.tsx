import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

interface UseScrollToSectionProps {
  sectionId: string;
  scrollBehavior?: ScrollBehavior;
}

const useScrollToSection = ({
  sectionId,
  scrollBehavior = "smooth",
}: UseScrollToSectionProps) => {
  const location = useLocation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  const scrollToSection = useCallback(() => {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    const section = searchParams.get("section");

    if (section === sectionId && sectionRef.current && !hasScrolled) {
      sectionRef.current.scrollIntoView({ behavior: scrollBehavior });
      setHasScrolled(true);
    }
  }, [sectionId, scrollBehavior, hasScrolled]);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    const section = searchParams.get("section");

    if (section !== sectionId) {
      setHasScrolled(false);
    }

    scrollToSection();

    // Attempt to scroll again after a short delay
    // In case the first scroll attempt fails because the content or ref isn't ready
    const timeoutId = setTimeout(() => {
      scrollToSection();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [scrollToSection, location, sectionId]);

  return sectionRef;
};

export default useScrollToSection;

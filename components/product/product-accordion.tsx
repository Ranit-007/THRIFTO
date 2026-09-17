"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ProductAccordionProps {
  sections: Array<{
    title: string;
    content: React.ReactNode;
  }>;
}

export function ProductAccordion({ sections }: ProductAccordionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  return (
    <div className="product-accordion">
      {sections.map((section, index) => {
        const isOpen = openSections.has(section.title);
        return (
          <div key={section.title} className="product-accordion__section">
            <button
              type="button"
              onClick={() => toggleSection(section.title)}
              className="product-accordion__header"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${index}`}
            >
              <h3 className="product-accordion__title">{section.title}</h3>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              >
                <ChevronDown aria-hidden="true" size={18} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${index}`}
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 },
                  }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="product-accordion__content"
                >
                  <div className="product-accordion__body">{section.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

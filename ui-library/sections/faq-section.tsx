"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  headline?: string;
  subheadline?: string;
  items: FAQItem[];
  className?: string;
}

export function FAQSection({
  headline = "Frequently Asked Questions",
  subheadline,
  items,
  className,
}: FAQSectionProps) {
  return (
    <section className={cn("px-6 py-24 md:py-32", className)}>
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-[var(--font-display-lg)] font-bold tracking-tight text-[var(--color-text)]">
            {headline}
          </h2>
          {subheadline && (
            <p className="mt-4 text-[var(--font-text-lg)] text-[var(--color-text-secondary)]">
              {subheadline}
            </p>
          )}
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <Accordion type="single" collapsible>
            {items.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

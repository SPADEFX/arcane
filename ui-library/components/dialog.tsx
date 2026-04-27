"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@uilibrary/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay asChild>
      <motion.div
        className="fixed inset-0 z-[var(--z-overlay)] bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    </DialogPrimitive.Overlay>
    <DialogPrimitive.Content ref={ref} asChild {...props}>
      <motion.div
        className={cn(
          "fixed left-1/2 top-1/2 z-[var(--z-modal)]",
          "w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
          "rounded-[var(--radius-2xl)] border border-[var(--color-border)]",
          "bg-[var(--color-bg)] p-8 shadow-[var(--shadow-2xl)]",
          "focus:outline-none",
          className,
        )}
        initial={{ opacity: 0, scale: 0.95, y: "-48%", x: "-50%" }}
        animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
        exit={{ opacity: 0, scale: 0.95, y: "-48%", x: "-50%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

export const DialogTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-[var(--font-display-xs)] font-semibold text-[var(--color-text)]",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      "mt-2 text-[var(--font-text-md)] text-[var(--color-text-secondary)]",
      className,
    )}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

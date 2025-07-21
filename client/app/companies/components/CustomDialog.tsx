import { useCallback, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AppButton from "~/dashboard/components/appButton";
// import AppButton from "~/components/appButton";

interface CustomDialogProps {
  visible: boolean;
  header?: string;
  children: React.ReactNode;
  onHide: () => void;
  footer?: React.ReactNode;
  width?: string; // Largeur personnalisée (ex: "40vw", "500px")
  maxWidth?: string; // Largeur maximale (ex: "600px")
  style?: React.CSSProperties;
  className?: string;
}

export default function CustomDialog({
  visible,
  header,
  children,
  onHide,
  footer,
  width = "50vw",
  maxWidth = "600px",
  className = "",
  style = {},
}: CustomDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);

  // Gérer la fermeture avec la touche Échap
  useEffect(() => {
    if (visible && dialogRef.current) {
      // Find all focusable elements within the dialog
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0] as HTMLElement;
      const lastFocusable = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      firstFocusableRef.current = firstFocusable;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onHide();
          e.preventDefault();
        }
        if (e.key === "Tab") {
          if (
            e.shiftKey &&
            document.activeElement === firstFocusable
          ) {
            lastFocusable.focus();
            e.preventDefault();
          } else if (
            !e.shiftKey &&
            document.activeElement === lastFocusable
          ) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      };

      // Focus the first element when dialog opens
      firstFocusable?.focus();
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [visible, onHide]);

  // Gérer le focus initial pour l'accessibilité
  useEffect(() => {
    if (visible && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [visible]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onHide();
      }
    },
    [onHide]
  );

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
          role="dialog"
          onClick={handleOverlayClick}
          aria-modal="true"
          aria-labelledby={header ? "dialog-title" : undefined}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              delay: 0.1
            }}
            ref={dialogRef}
            className={`bg-white dark:bg-neutral-dark-surface rounded-xl max-w-2xl w-full shadow-xl m-4 p-6 transform transition-all duration-300 scale-100 overflow-hidden ${className || ""}`}
            style={{ width, maxWidth }}
            tabIndex={-1}
          >
            {header && (
            <div className="flex justify-between items-center mb-4 p-4 bg-neutral-light-bg">
              <h2
                id="dialog-title"
                className="text-xl font-bold text-neutral-light-text dark:text-neutral-dark-text"
              >
                {header}
              </h2>
              <AppButton
                icon={<FiX />}
                type="secondary"
                size="sm"
                outlined
                onClick={onHide}
                className="text-neutral-light-text dark:text-neutral-dark-text hover:bg-neutral-light-bg dark:hover:bg-neutral-dark-bg"
                aria-label="Fermer la boîte de dialogue"
              />
            </div>
            )}
            <div className="mb-4 p-6 max-h-[70vh] overflow-y-auto text-neutral-light-text dark:text-neutral-dark-text">
              {children}
            </div>
            {footer && (
              <div className="flex justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
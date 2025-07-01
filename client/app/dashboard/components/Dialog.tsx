// ~/components/Dialog.tsx
import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { FiX } from "react-icons/fi";

interface DialogProps {
    visible: boolean;
    header?: string;
    onHide: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

export default function Dialog({
    visible,
    header,
    onHide,
    children,
    footer,
    style,
    className = ""
}: DialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const firstFocusableRef = useRef<HTMLElement | null>(null);

    // Focus trap for accessibility
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

    // GSAP animation for dialog and overlay
    useEffect(() => {
        if (visible && dialogRef.current && overlayRef.current) {
            const tl = gsap.timeline();
            tl.fromTo(
                overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power3.out" }
            ).fromTo(
                dialogRef.current,
                { opacity: 0, scale: 0.98, y: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power3.out"
                },
                "-=0.2"
            );

            return () => {
                tl.kill();
            };
        }
    }, [visible]);

    // Close dialog on overlay click
    const handleOverlayClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === overlayRef.current) {
                onHide();
            }
        },
        [onHide]
    );

    if (!visible) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 bg-neutral-dark-bg bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={header ? "dialog-header" : undefined}
        >
            <div
                ref={dialogRef}
                className={`bg-neutral-light-surface dark:bg-neutral-dark-surface rounded-xl shadow-2xl max-w-2xl w-full m-4 border border-neutral-light-border dark:border-neutral-dark-border overflow-hidden ${className}`}
                style={style}
            >
                {header && (
                    <div className="flex justify-between items-center p-4 bg-neutral-light-bg dark:bg-neutral-dark-bg border-b border-neutral-light-border dark:border-neutral-dark-border">
                        <h2
                            id="dialog-header"
                            className="text-xl font-bold text-neutral-light-text dark:text-neutral-dark-text"
                        >
                            {header}
                        </h2>
                        <button
                            onClick={onHide}
                            className="text-neutral-light-secondary dark:text-neutral-dark-secondary hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1"
                            aria-label="Fermer le dialogue"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                )}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
                {footer && (
                    <div className="p-4 bg-neutral-light-bg dark:bg-neutral-dark-bg border-t border-neutral-light-border dark:border-neutral-dark-border">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

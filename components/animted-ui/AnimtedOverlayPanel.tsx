import React, { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import PageHeader from "../layout/PageHeader";
import { cn } from "@/lib/utils";

type Direction = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface AnimationVariants {
  initial: string;
  animate: string;
}

const directions: Record<Direction, AnimationVariants> = {
  "top-left": {
    initial: "circle(0% at top left)",
    animate: "circle(150% at top left)",
  },
  "top-right": {
    initial: "circle(0% at top right)",
    animate: "circle(150% at top right)",
  },
  "bottom-left": {
    initial: "circle(0% at bottom left)",
    animate: "circle(150% at bottom left)",
  },
  "bottom-right": {
    initial: "circle(0% at bottom right)",
    animate: "circle(150% at bottom right)",
  },
};

interface AnimatedOverlayPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: (props: { onClick: () => void }) => ReactNode;
  content: ReactNode;
  title?: string;
  description?: string;
  direction?: Direction;
  backgroundClassName?: string;
  containerClassName?: string;
}

const AnimatedOverlayPanel: React.FC<AnimatedOverlayPanelProps> = ({
  open,
  onOpenChange,
  trigger,
  content,
  direction = "bottom-right",
  backgroundClassName = "bg-black",
  title,
  description,
  containerClassName,
}) => {
  useEffect(() => {
    if (open) {
      // Push a new state to the history when opening the overlay
      window.history.pushState({ overlay: true }, "");

      // Add a popstate event listener
      const handlePopState = (event: PopStateEvent) => {
        if (event.state && event.state.overlay) {
          // If the popped state has the overlay flag, do nothing
          // This prevents closing the overlay when going forward
        } else {
          // If it's a genuine back action, close the overlay
          onOpenChange(false);
        }
      };

      window.addEventListener("popstate", handlePopState);

      // Clean up the event listener when the component unmounts or when the overlay closes
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [open, onOpenChange]);

  const variants = {
    initial: { clipPath: directions[direction].initial },
    animate: { clipPath: directions[direction].animate },
    exit: { clipPath: directions[direction].initial },
  };

  const handleClose = () => {
    onOpenChange(false);
    // When closing the overlay, go back in history
    window.history.back();
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={cn(
              "fixed inset-0 z-50 overflow-y-auto",
              containerClassName,
              backgroundClassName
            )}
          >
            <div className="p-6">
              <div className="flex justify-between">
                {title && (
                  <PageHeader
                    disableMargin
                    title={title}
                    description={description}
                  />
                )}
                <div className="flex justify-end -mr-4">
                  <Button onClick={handleClose} variant="ghost">
                    <X size={24} />
                  </Button>
                </div>
              </div>
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ opacity: open ? 0 : 1, scale: open ? 0.8 : 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 w-full"
      >
        {trigger({ onClick: () => onOpenChange(true) })}
      </motion.div>
    </>
  );
};

export default AnimatedOverlayPanel;

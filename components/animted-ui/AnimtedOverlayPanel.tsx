import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import PageHeader from "../layout/PageHeader";
import { title } from "process";
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
  const variants = {
    initial: { clipPath: directions[direction].initial },
    animate: { clipPath: directions[direction].animate },
    exit: { clipPath: directions[direction].initial },
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
                  <Button onClick={() => onOpenChange(false)} variant="ghost">
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

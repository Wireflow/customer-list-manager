import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog as ShadcnDialog,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  trigger?: React.ReactNode;
  content: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  disableClose?: boolean;
  footer?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  contentClassName?: string;
  onClose?: () => void;
};

const Dialog = ({
  trigger,
  content,
  title,
  description,
  open,
  onOpenChange,
  className,
  contentClassName,
  footer,
  disableClose = false,
  disabled = false,
  modal = true,
  onClose,
}: Props) => {
  return (
    <ShadcnDialog open={open} onOpenChange={onOpenChange} modal={modal}>
      {trigger && (
        <DialogTrigger className="w-full" disabled={disabled} asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent
        onPointerDownOutside={(e) => {
          if (disableClose) {
            e.preventDefault();
          }
        }}
        className={cn("overflow-hidden max-h-[90vh] flex flex-col", className)}
        onCloseAutoFocus={onClose}
      >
        <div className={cn("flex flex-col h-full", contentClassName)}>
          {title || description ? (
            <DialogHeader className="flex-shrink-0">
              {title && (
                <DialogTitle className="text-2xl font-bold">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription className="text-base">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          ) : null}
          <div className="flex-grow overflow-auto px-1">{content}</div>
          {footer && (
            <DialogFooter className="flex-shrink-0">{footer}</DialogFooter>
          )}
        </div>
      </DialogContent>
    </ShadcnDialog>
  );
};

export default Dialog;

import React from "react";
import { Button, ButtonProps } from "../ui/button";

type Props = ButtonProps & {
  pendingText: string;
  pending: boolean;
};

const SubmitButton = ({
  pendingText = "Submitting",
  pending,
  children,
  ...props
}: Props) => {
  return (
    <Button disabled={pending} aria-disabled={pending} {...props}>
      {children}
    </Button>
  );
};

export default SubmitButton;

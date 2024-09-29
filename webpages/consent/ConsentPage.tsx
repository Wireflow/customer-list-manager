import ConsentForm from "@/components/features/consent/ConsentForm";
import React from "react";

type Props = {};

const ConsentPage = (props: Props) => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <ConsentForm />
    </div>
  );
};

export default ConsentPage;

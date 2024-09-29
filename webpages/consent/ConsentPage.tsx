import ConsentForm from "@/components/features/consent/ConsentForm";
import PageHeader from "@/components/layout/PageHeader";
import React from "react";

type Props = {};

const ConsentPage = (props: Props) => {
  return (
    <div className="flex h-full flex-col items-center md:justify-center mt-4">
      <div className="grid p-4">
        <PageHeader
          disableMargin
          title="Opt-in to Text Messages"
          description="Opt-in to receive text messages"
        />
        <ConsentForm />
      </div>
    </div>
  );
};

export default ConsentPage;

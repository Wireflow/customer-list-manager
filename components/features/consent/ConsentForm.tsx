"use client";

import InputField from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useConsentMutation } from "@/hooks/mutations/consent/useConsentMutation";
import { ConsentSchema, ConsentType } from "@/types/validation/consent";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {};

const ConsentForm = (props: Props) => {
  const mutation = useConsentMutation();

  const form = useForm<ConsentType>({
    resolver: zodResolver(ConsentSchema),
    defaultValues: {
      phoneNumber: "",
      consent: false,
      branchId: "",
      userId: "",
      name: "",
    },
  });

  const onSubmit = (data: ConsentType) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputField
          name="phoneNumber"
          label="Phone Number"
          control={form.control}
        />
        <InputField name="consent" label="Consent" control={form.control} />
        <InputField name="branchId" label="Branch ID" control={form.control} />
        <InputField name="userId" label="User ID" control={form.control} />
        <InputField name="name" label="Name" control={form.control} />

        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ConsentForm;

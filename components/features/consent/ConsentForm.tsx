"use client";

import CheckboxField from "@/components/form/CheckboxField";
import InputField from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useConsentMutation } from "@/hooks/mutations/consent/useConsentMutation";
import { formatPhoneInputValue } from "@/lib/utils";
import { ConsentSchema, ConsentType } from "@/types/validation/consent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {};

const ConsentForm = (props: Props) => {
  const { id: branchId } = useParams<{ id: string }>();
  const router = useRouter();

  const { mutate, isPending: isMutating } = useConsentMutation({
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.error ?? "Failed to submit consent");
        return;
      }
      toast.success("Successfully opted in to text messages");
      router.replace("/opted");
    },
  });

  const form = useForm<ConsentType>({
    resolver: zodResolver(ConsentSchema),
    defaultValues: {
      phoneNumber: "",
      opted: false,
      optedAt: new Date().toISOString(),
      branchId,
      name: "",
    },
  });

  const onSubmit = (data: ConsentType) => {
    if (!data.opted) {
      form.setError("opted", {
        message: "You must agree to receive text messages.",
      });
    }

    const cleanedPhone = data.phoneNumber.replace(/[\s()-]/g, "");

    mutate({
      ...data,
      phoneNumber: cleanedPhone,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneInputValue(e.target.value);
    form.setValue("phoneNumber", formattedValue);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputField
          name="phoneNumber"
          label="Phone Number"
          onChange={handlePhoneChange}
          type="tel"
          placeholder="(123) 456 - 7890"
          control={form.control}
        />

        <InputField
          name="name"
          label="Business Name / Nickname (optional)"
          placeholder="ex. John Doe / JD"
          control={form.control}
        />

        <div className="mt-6">
          <CheckboxField
            name="opted"
            label="Opt-in to receiving text messages"
            form={form}
          />
        </div>
        <div className="mt-2">
          <Label>SMS Sharing Dislosure:</Label>
          <p className="text-sm text-gray-500">
            No mobile information will be shared with third parties/affiliates
            for marketing/promotional purposes.
          </p>
        </div>

        <Button
          type="submit"
          className="mt-4 w-full"
          size={"lg"}
          disabled={
            isMutating ||
            !form.formState.isValid ||
            !form.formState.dirtyFields.opted
          }
          loading={isMutating}
        >
          Opt in to text messages <Check className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </Form>
  );
};

export default ConsentForm;

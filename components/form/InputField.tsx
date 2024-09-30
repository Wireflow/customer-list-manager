import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input, InputProps } from "../ui/input";
import { useController } from "react-hook-form";

type Props = InputProps & {
  control: any;
  name: string;
  label?: string;
  description?: string;
};

const InputField = ({
  control,
  name,
  label,
  description,
  onChange,
  ...props
}: Props) => {
  const { field } = useController({
    name,
    control,
    rules: { value: props.type === "number" || props.type === "date" },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (props.type === "number") {
      const regex = /^[0-9\b]+$/;

      if (e.target.value === "" || regex.test(e.target.value)) {
        value = e.target.value;
      }

      // Convert to number or null for the form
      field.onChange(value === "" ? null : Number(value));
    } else {
      field.onChange(value);
    }

    // Call the provided onChange handler if it exists
    onChange?.(e);
  };

  return (
    <FormField
      name={name}
      control={control}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...props}
              value={field.value ?? ""}
              onChange={handleChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              inputMode={props.type === "number" ? "decimal" : undefined}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;

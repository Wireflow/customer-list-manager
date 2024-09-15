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

const InputField = ({ control, name, label, description, ...props }: Props) => {
  const { field } = useController({
    name,
    control,
    rules: { value: props.type === "number" },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (props.type === "number") {
      field.onChange(value === "" ? null : parseFloat(value));
    } else {
      field.onChange(value);
    }
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

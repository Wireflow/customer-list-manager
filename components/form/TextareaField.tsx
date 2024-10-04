import { useController } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea, TextareaProps } from "../ui/textarea";

type Props = TextareaProps & {
  control: any;
  name: string;
  label?: string;
  description?: string;
};

const TextareaField = ({
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
  });

  return (
    <FormField
      name={name}
      control={control}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              {...props}
              value={field.value ?? ""}
              onChange={field.onChange}
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

export default TextareaField;

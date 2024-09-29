import { useController } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputProps } from "../ui/input";

type Props = InputProps & {
  control: any;
  name: string;
  label?: string;
  description?: string;
};

const CheckboxField = ({
  control,
  name,
  label,
  description,
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
            <Checkbox {...props} {...field} ref={field.ref} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;

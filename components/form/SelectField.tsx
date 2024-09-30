import { useController } from "react-hook-form";
import Select, { QuickSelectProps } from "../shared-ui/Select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

type Props = Partial<QuickSelectProps> & {
  control: any;
  name: string;
  label?: string;
  description?: string;
};

const SelectField = ({
  control,
  name,
  label,
  description,
  onValueChange,
  options,
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
            <Select
              {...props}
              options={options ?? []}
              value={field.value ?? ""}
              onValueChange={(Value) => field.onChange(Value)}
              defaultValue={field.value}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectField;

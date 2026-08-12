import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Frequency } from "@/generated/prisma/enums";

const frequencyOptions = [
  { value: "DAILY", label: "Diaria" },
  { value: "WEEKLY", label: "Semanal" },
  { value: "MONTHLY", label: "Mensual" },
];

function FrequencySelect({
  value,
  onchange,
}: {
  value: Frequency;
  onchange: (value: Frequency) => void;
}) {
  const selectedFrequency = frequencyOptions.find(
    (option) => option.value === value,
  );
  return (
    <Select
      value={value ?? undefined}
      onValueChange={(newValue) => {
        if (newValue !== null) {
          onchange(newValue);
        }
      }}
    >
      <SelectTrigger>
        {selectedFrequency?.label ?? "Seleccionar frecuencia"}
      </SelectTrigger>

      <SelectContent>
        {frequencyOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default FrequencySelect;

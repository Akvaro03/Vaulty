import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { DayOfWeek } from "@/generated/prisma/enums";

const frequencyOptions = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

function DayOfWeekSelect({
  value,
  onchange,
}: {
  value: DayOfWeek | null;
  onchange: (value: DayOfWeek | null) => void;
}) {
  const selectedFrequency = frequencyOptions.find(
    (option) => option.value === value,
  );
  return (
    <Select value={value ?? undefined} onValueChange={onchange}>
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

export default DayOfWeekSelect;

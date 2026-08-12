import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dayOptions = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;

  return {
    value: day.toString(),
    label: `Día ${day}`,
  };
});

function DayOfMonthSelect({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <Select
      value={value?.toString() ?? undefined}
      onValueChange={(value) => onChange(Number(value))}
    >
      <SelectTrigger>
        <SelectValue placeholder="Seleccionar día" />
      </SelectTrigger>

      <SelectContent>
        {dayOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default DayOfMonthSelect;

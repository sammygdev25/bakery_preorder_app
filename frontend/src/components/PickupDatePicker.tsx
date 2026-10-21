import { useMemo } from 'react';
import { Icon } from '../components/icons';

interface PickupDatePickerProps {
  selectedDate: string;
  onChange: (date: string) => void;
}

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

function PickupDatePicker({ selectedDate, onChange }: PickupDatePickerProps) {
  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    const min = new Date(today);
    min.setDate(min.getDate() + 1);
    const max = new Date(today);
    max.setDate(max.getDate() + 30);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return { minDate: fmt(min), maxDate: fmt(max) };
  }, []);

  const [datePart, timePart] = useMemo(() => {
    if (!selectedDate) return ['', '10:00'];
    const [d, t] = selectedDate.split('T');
    return [d || '', t ? t.slice(0, 5) : '10:00'];
  }, [selectedDate]);

  const handleDateChange = (value: string) => {
    if (!value) {
      onChange('');
      return;
    }
    onChange(`${value}T${timePart}:00`);
  };

  const handleTimeChange = (value: string) => {
    if (!datePart) return;
    onChange(`${datePart}T${value}:00`);
  };

  return (
    <div className="ds-field">
      <label className="ds-label">
        <Icon name="calendar" size={16} /> Pickup date
      </label>
      <input
        type="date"
        className="input"
        value={datePart}
        min={minDate}
        max={maxDate}
        onChange={(e) => handleDateChange(e.target.value)}
      />
      <label className="ds-label" style={{ marginTop: '0.75rem' }}>
        <Icon name="clock" size={16} /> Pickup time
      </label>
      <select
        className="input"
        value={timePart}
        disabled={!datePart}
        onChange={(e) => handleTimeChange(e.target.value)}
      >
        {TIME_SLOTS.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>
      <p className="ds-help">
        Orders need at least 24 hours' notice so our bakers have time to prepare your cakes and pastries fresh.
      </p>
    </div>
  );
}

export default PickupDatePicker;
export { PickupDatePicker };
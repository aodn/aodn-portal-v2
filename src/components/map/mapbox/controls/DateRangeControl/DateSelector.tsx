import React from "react";

interface DateSelectorProps {
  minDate: string;
  maxDate: string;
  onSelectorChange: (startDate: string, endDate: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  minDate,
  maxDate,
  onSelectorChange,
}) => {
  return <div>date selector</div>;
};

export default DateSelector;

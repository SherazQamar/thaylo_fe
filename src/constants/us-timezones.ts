export interface UsTimezoneOption {
  value: string;
  label: string;
}

/** IANA time zones used in the United States and its territories. */
export const US_TIMEZONES: UsTimezoneOption[] = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Phoenix", label: "Mountain Time — Arizona (no DST)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "America/Adak", label: "Hawaii-Aleutian Time — Aleutian Islands" },
  { value: "America/Puerto_Rico", label: "Atlantic Time — Puerto Rico & US Virgin Islands" },
  { value: "Pacific/Guam", label: "Chamorro Time — Guam & Northern Mariana Islands" },
  { value: "Pacific/Pago_Pago", label: "Samoa Time — American Samoa" },
];

export function normalizeCmi(
  cmi: Record<string, string>
): Record<string, string> {
  return {
    "cmi.core.lesson_status": cmi["cmi.core.lesson_status"] || "not attempted",
    "cmi.core.entry": cmi["cmi.core.entry"] || "ab-initio",
    "cmi.core.exit": "",
    "cmi.suspend_data": cmi["cmi.suspend_data"] || "",
    ...cmi
  };
}

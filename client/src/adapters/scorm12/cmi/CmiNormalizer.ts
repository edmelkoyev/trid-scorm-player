export function normalizeCmi(
  cmi: Record<string, string>
): Record<string, string> {
  return {
    "cmi._version": cmi["cmi._version"] || "3.4",
    "cmi.core.student_id": cmi["cmi.core.student_id"] || "",
    "cmi.core.student_name": cmi["cmi.core.student_name"] || "",
    "cmi.core.lesson_location": cmi["cmi.core.lesson_location"] || "",
    "cmi.core.credit": cmi["cmi.core.credit"] || "credit",
    "cmi.core.lesson_status": cmi["cmi.core.lesson_status"] || "not attempted",
    "cmi.core.entry": cmi["cmi.core.entry"] || "ab-initio",
    "cmi.core.score.raw": cmi["cmi.core.score.raw"] || "",
    "cmi.core.score.max": cmi["cmi.core.score.max"] || "",
    "cmi.core.score.min": cmi["cmi.core.score.min"] || "",
    "cmi.core.total_time": cmi["cmi.core.total_time"] || "0000:00:00.00",
    "cmi.core.lesson_mode": cmi["cmi.core.lesson_mode"] || "normal",
    "cmi.core.exit": "",
    "cmi.suspend_data": cmi["cmi.suspend_data"] || "",
    "cmi.launch_data": cmi["cmi.launch_data"] || "",
    ...cmi
  };
}

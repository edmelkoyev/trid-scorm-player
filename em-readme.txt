cmi.core.entry
=========================
Indicates how the learner entered the SCO.

- "ab-initio" → first launch
- "resume" → returning to a suspended attempt
- empty ("") → LMS-specific or completed attempt

LMS: set value
SCO: get value and use it for resume in combination with cmi.core.lesson_location



cmi.core.lesson_status
=========================
Indicates the learner’s completion and success state for the SCO.

Valid values (SCORM 1.2):
- "not attempted"
- "incomplete"
- "completed"
- "passed"
- "failed"
- "browsed" (rarely used)

SCO: set value / get value
LMS: ?

On SCO launch: "incomplete"
On successful completion: "completed"
  If assessment-based: "passed" / "failed"

Don’t downgrade status:
  Once set to "completed" or "passed", do not revert to "incomplete"


cmi.core.exit
=========================
Tells the LMS how the learner exited the SCO.

- "time-out" → max_time_allowed has been exceeded
- "suspend" → learner intends to resume later
- "logout" → normal exit
- empty ("") → session ended without intent to resume


SCO: set value
LMS: ? 405, 401



/* eslint-disable quote-props */
export const CMI_CHILDREN_MAP: Record<string, string[]> = {
  'cmi': [
    'core',
    'objectives',
    'student_data',
    'student_preference',
    'interactions',
    'comments',
  ],

  'cmi.core': [
    'student_id',
    'student_name',
    'lesson_location',
    'credit',
    'lesson_status',
    'entry',
    'score',
    'total_time',
    'lesson_mode',
    'exit',
    'session_time',
  ],

  'cmi.core.score': [
    'raw',
    'min',
    'max',
  ],

  'cmi.objectives': [
    '_count',
  ],

  'cmi.objectives.n': [
    'id',
    'score',
    'status',
  ],

  'cmi.objectives.n.score': [
    'raw',
    'min',
    'max',
  ],

  'cmi.student_data': [
    'mastery_score',
    'max_time_allowed',
    'time_limit_action',
  ],

  'cmi.student_preference': [
    'audio',
    'language',
    'speed',
    'text',
  ],

  'cmi.interactions': [
    '_count',
  ],

  'cmi.interactions.n': [
    'id',
    'objectives',
    'time',
    'type',
    'correct_responses',
    'weighting',
    'student_response',
    'result',
    'latency',
  ],

  'cmi.interactions.n.objectives': [
    '_count',
  ],

  'cmi.interactions.n.correct_responses': [
    '_count',
  ],

  'cmi.comments': [
    '_count',
  ],
};

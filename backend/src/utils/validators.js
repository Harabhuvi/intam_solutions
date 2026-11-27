
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.code = 'BAD_USER_INPUT';
  }
}

const ENQUIRY_STATUSES = new Set(['pending', 'resolved', 'in-progress']);
const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d\s().-]{6,30}$/;
const LIMITS = { name: 100, email: 254, message: 5000, search: 100 };

const parseObjectId = (id) => {
  const value = String(id || '');
  if (!OBJECT_ID_RE.test(value)) throw new ValidationError('Invalid ID.');
  return value;
};

const parseStatusFilter = (status) => {
  if (status && status !== 'all' && !ENQUIRY_STATUSES.has(status)) {
    throw new ValidationError('Invalid enquiry status.');
  }
  return status;
};

const parseStatus = (status) => {
  if (!ENQUIRY_STATUSES.has(status)) throw new ValidationError('Invalid status value.');
  return status;
};

const cleanSearch = (search) =>
  typeof search === 'string' ? search.trim().slice(0, LIMITS.search) : undefined;

const clampLimit = (limit) => Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

const parseContactInput = (args) => {
  const name = String(args.name ?? '').trim();
  const email = String(args.email ?? '').trim().toLowerCase();
  const phone = args.phone ? String(args.phone).trim() : undefined;
  const message = String(args.message ?? '').trim();

  if (!name || name.length > LIMITS.name || /[\r\n]/.test(name)) {
    throw new ValidationError('Please provide a valid name.');
  }
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) {
    throw new ValidationError('Please provide a valid email address.');
  }
  if (phone && !PHONE_RE.test(phone)) {
    throw new ValidationError('Please provide a valid phone number.');
  }
  if (!message || message.length > LIMITS.message) {
    throw new ValidationError(`Message must be between 1 and ${LIMITS.message} characters.`);
  }
  return { name, email, phone, message };
};

module.exports = {
  ValidationError,
  ENQUIRY_STATUSES,
  parseObjectId,
  parseStatusFilter,
  parseStatus,
  cleanSearch,
  clampLimit,
  parseContactInput,
};
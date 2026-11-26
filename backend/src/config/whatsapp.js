const configuredNumber = String(process.env.WHATSAPPNUMBER || '').replace(/\D/g, '');

if (configuredNumber && !/^\d{8,15}$/.test(configuredNumber)) {
  throw new Error('WHATSAPPNUMBER must contain 8 to 15 digits in international format.');
}

const whatsappHref = configuredNumber ? `https://wa.me/${configuredNumber}` : '';

module.exports = { configuredNumber, whatsappHref };

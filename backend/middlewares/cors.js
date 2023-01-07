// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'http://lebedeva.nomoredomains.club',
  'https://lebedeva.nomoredomains.club',
  'http://lebedeva.back.nomoredomains.club',
  'https://lebedeva.back.nomoredomains.club',
  'http://localhost:3000',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const corsMiddlewar = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Origin', origin);

    return res.end();
  }
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  return next();
};

module.exports = {
  corsMiddlewar,
};

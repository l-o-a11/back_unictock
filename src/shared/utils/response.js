const ok          = (res, data)    => res.status(200).json({ success: true,  data });
const created     = (res, data)    => res.status(201).json({ success: true,  data });
const badRequest  = (res, message) => res.status(400).json({ success: false, error: message });
const unauthorized= (res, message) => res.status(401).json({ success: false, error: message });
const notFound    = (res, message) => res.status(404).json({ success: false, error: message });
const conflict    = (res, message) => res.status(409).json({ success: false, error: message });
const unprocessable=(res, message) => res.status(422).json({ success: false, error: message });
const serverError = (res, message = 'Internal Server Error') =>
  res.status(500).json({ success: false, error: message });

module.exports = {
  ok,
  created,
  badRequest,
  unauthorized,
  notFound,
  conflict,
  unprocessable,
  serverError,
};
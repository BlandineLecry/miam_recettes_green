const jwt = require('jsonwebtoken');
const secretKey = 'votre_cle_secrete';

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Accès non autorisé' });
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token invalide' });
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
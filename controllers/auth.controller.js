const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Bu e-posta adresine ait kullanıcı bulunamadı.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Hatalı şifre girdiniz.' });

  
    const token = jwt.sign({ id: user.id, email: user.email }, 'gizliAnahtar123', { expiresIn: '1d' });

    res.json({
      message: 'Giriş başarılı!',
      token: token,
      user: { id: user.id, fullName: user.fullName, email: user.email, status: user.status }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
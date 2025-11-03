import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// 动态获取配置，不设默认值
const getAdminConfig = () => {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.JWT_SECRET;
  
  // 检查环境变量是否设置
  if (!password || !secret) {
    console.error('❌ 环境变量未正确设置:');
    console.error('ADMIN_PASSWORD:', password ? '已设置' : '未设置');
    console.error('JWT_SECRET:', secret ? '已设置' : '未设置');
    throw new Error('环境变量未正确配置');
  }
  
  return { password, secret };
};

// 管理员登录
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    const ADMIN_CONFIG = getAdminConfig(); // 动态获取配置

    console.log('登录尝试检查环境变量:', {
      hasPassword: !!ADMIN_CONFIG.password,
      passwordLength: ADMIN_CONFIG.password?.length
    });

    // 验证密码
    if (password !== ADMIN_CONFIG.password) {
      console.log('密码验证失败');
      return res.status(401).json({ 
        success: false,
        error: 'Invalid password' 
      });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { 
        role: 'admin',
        timestamp: Date.now()
      },
      ADMIN_CONFIG.secret,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { role: 'admin' },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Internal server error' 
    });
  }
});

// 验证 token 中间件
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const ADMIN_CONFIG = getAdminConfig(); // 动态获取配置

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, ADMIN_CONFIG.secret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Server configuration error' });
  }
};

export default router;
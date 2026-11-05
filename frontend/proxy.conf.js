// Proxy do dev-server (Vite): remove o prefixo /api antes de encaminhar ao Spring Boot.
// /api/modulos/menu -> http://localhost:8080/modulos/menu
// Sintaxe de função (rewrite) em .js: o JSON não comporta função e pathRewrite não é garantido no builder Vite.
module.exports = {
  '/api': {
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
};

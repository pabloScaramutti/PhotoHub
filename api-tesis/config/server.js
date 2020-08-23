module.exports = ({ env }) => ({
  host: env('HOST', '192.168.0.123'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '3b2a452023d1ac25c83a95f11d1af993'),
    },
  },
});

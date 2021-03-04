module.exports = {
  //...
  settings: {
    parser: {
      enabled: true,
      multipart: true,
      formidable: {
        maxFileSize: 10000 * 1024 * 1024 //  10gb
      }
    }
  },
  //...
};
module.exports = {
  apps : [
      {
        name: "nikki",
        script: "index.js",
        watch: true,
        env: {
          "NODE_ENV": "production",
        }
      }
  ]
}

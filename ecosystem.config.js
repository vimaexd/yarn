module.exports = {
  apps : [
      {
        name: "nikki",
        script: "dist/src/index.js",
        watch: true,
        env: {
          "NODE_ENV": "production",
        }
      }
  ]
}

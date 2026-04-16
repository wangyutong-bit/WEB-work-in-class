module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": [
    [
      "import",
      {
        "libraryName": "view-ui-plus",
        "libraryDirectory": "src/components"
      },
      "view-ui-plus"
    ]
  ]
}

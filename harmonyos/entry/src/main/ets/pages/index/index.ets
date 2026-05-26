@Entry
@Component
struct Index {
  controller: WebviewController = new WebviewController();

  build() {
    Column() {
      Web({ src: 'http://101.201.173.122', controller: this.controller })
        .width('100%')
        .height('100%')
        .javaScriptAccess(true)
        .fileAccess(true)
        .imageAccess(true)
    }
    .width('100%')
    .height('100%')
  }
}
const sketch = require("sketch/dom");
const Group = require("sketch/dom").Group;
const UI = require("sketch/ui");

////////////////////////////////////////////////////////////////////////////////
/* NSString to js string*/
function toJSString(NSStr) {
  var config = arguments.length > 1 ? arguments[1] : null;
  var str = new String(NSStr).toString();

  if (config && config.escapeLine) {
    str = str.replace(/\\-/g, "-");
  }

  if (config && config.encode) {
    str = encodeURIComponent(str);
  }
  return str;
}

////////////////////////////////////////////////////////////////////////////////
/* 生成切片 */
function handlerSlice(layer, options) {
  //根据宽高计算并新建切片
  //新建一个包含图层的group，用于包含图层和切片
  let group = MSLayerGroup.groupWithLayer(layer);
  let groupName = toJSString(layer.name()); //获取图层的名称
  group.setName(groupName); //将group名设置为图层的名称

  let slice = MSSliceLayer.sliceLayerFromLayer(layer); //用sketch提供的object-c API创建一个切片
  let layerFrame = layer.frame();
  let sliceFrame = slice.frame();

  //切片设置为输入的宽高，若未输入宽高，则按照图层的实际大小设置切片宽高
  sliceFrame.setWidth(options.width || layerFrame.width());
  sliceFrame.setHeight(options.height || layerFrame.height());

  //计算切片与图层的位置差
  let sliceX = Math.floor((layerFrame.width() - sliceFrame.width()) / 2);
  let sliceY = Math.floor((layerFrame.height() - sliceFrame.height()) / 2);

  //   let sliceXFloor = Math.floor(sliceX);
  //   let sliceYFloor = Math.floor(sliceY);

  //按照位置差移动切片位置，使图层居中于切片中心
  sliceFrame.setX(sliceX);
  sliceFrame.setY(sliceY);

  return slice;
}
////////////////////////////////////////////////////////////////////////////////
/** 处理导出切片的参数 */
function handlerExportOpt(options) {
  let url = setSavePanel();
  console.log(url);
  return {
    output: url,
    formats: options.formats || "png",
    scales: options.scales[0] || [1],
    "group-contents-only": true
  };
}
////////////////////////////////////////////////////////////////////////////////
/** 导出路径的panel */
function setSavePanel() {
  let savePanel = NSSavePanel.savePanel();

  savePanel.setTitle("Export");
  savePanel.setNameFieldLabel("Export to");
  savePanel.setShowsTagField(false);
  savePanel.setCanCreateDirectories(true);

  if (savePanel.runModal() != NSOKButton) {
    log("cancel save");
    return false;
  } else {
    //返回导出路径
    return savePanel.URL().path();
  }
}
module.exports = {
  handlerSelection(selection, options) {
    let slices = []; //初始化切片数组
    let opt = handlerExportOpt(options); //导出切片的参数
    selection.forEach(layer => {
      let slice = handlerSlice(layer, options);
      //slice push进数组
      slices.push(slice);
    });

    //slice批量导出
    sketch.export(slices, opt);
  }
};

// call the plugin from the webview
//监听button点击事件
document.getElementById("btnExport").addEventListener("click", () => {
  //获取输入的宽高值、倍数、输出图片类型
  let width = document.getElementById("inputWidth").value || "",
    height = document.getElementById("inputHeight").value || "",
    scales = document.getElementsByClassName("scales");
  formats = document.getElementsByClassName("formats");
  let scalesArray = [],
    formatsArray = [];

  // 对倍数、图片类型的参数处理成数组
  Array.prototype.filter.call(scales, scale => {
    if (scale.checked) {
      scalesArray.push(scale.value);
    }
  });
  Array.prototype.filter.call(formats, format => {
    if (format.checked) {
      formatsArray.push(format.value);
    }
  });
  let formatsStr = Array.prototype.join.call(formatsArray);

  // 向plugin通信
  window.postMessage("getOptions", {
    width: width,
    height: height,
    formats: formatsStr,
    scales: scalesArray
  });
});

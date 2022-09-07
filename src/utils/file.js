/**
 * 下载文件
 * @param data 文件流
 * @param fileName 文件名称
 */
 export const downloadFile = (data, fileName) => {
  const blob = new Blob([data]);//,{type:'application/vnd.ms-excel;charset=utf-8'}
  const href = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = href;
  a.download = fileName;
  a.style.position = "fixed";
  a.style.left = "-999px";
  document.body.appendChild(a);

  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(href);
};

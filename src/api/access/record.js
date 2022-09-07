import request from '@/utils/request'

// 通行记录列表
export function listSuccessListPage (data) {
  return request({
    url: '/access/access-record/successListPage',
    method: 'post',
    data: data
  })
}


// 抓拍记录列表
export function listAccessPage (data) {
  return request({
    url: '/access/access-record/listPage',
    method: 'post',
    data: data
  })
}

// 导出通行记录
export const exportRecordData = (data) => {
  return request({
    url: `/access/access-record/access/export`,
    method: 'post',
    responseType:"arraybuffer",
    data: data
  })
}


// 导出抓拍记录
export const exportCaptureData = (data) => {
  return request({
    url: `/access/access-record/export`,
    method: 'post',
    responseType:"arraybuffer",
    data: data
  })
}



// // 查询设备详细
// export function getInstance (id) {
//   return request({
//     url: `/device/client-device/findById/${id}`,
//     method: 'get'
//   })
// }

// // 添加设备
// export function addInstance (data) {
//   return request({
//     url: '/device/client-device/create',
//     method: 'post',
//     data: data
//   })
// }


// // 修改设备
// export function updateInstance (data) {
//   return request({
//     url: '/device/client-device/modify',
//     method: 'post',
//     data: data
//   })
// }

// // 删除设备
// export function delInstance (id) {
//   return request({
//     url: `/device/client-device/remove/${id}`,
//     method: 'delete'
//   })
// }






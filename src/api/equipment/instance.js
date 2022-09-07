import request from '@/utils/request'

// 查询设备列表
export function listInstance (data) {
  return request({
    url: '/device/client-device/listClientDevicePage',
    method: 'post',
    data: data
  })
}

// 查询设备详细
export function getInstance (id) {
  return request({
    url: `/device/client-device/findById/${id}`,
    method: 'get'
  })
}

// 添加设备
export function addInstance (data) {
  return request({
    url: '/device/client-device/create',
    method: 'post',
    data: data
  })
}


// 修改设备
export function updateInstance (data) {
  return request({
    url: '/device/client-device/modify',
    method: 'post',
    data: data
  })
}

// 删除设备
export function delInstance (id) {
  return request({
    url: `/device/client-device/remove/${id}`,
    method: 'delete'
  })
}

// 获取设备状态数量
export function getInstanceNum (id) {
  return request({
    url: `/device/client-device/getStatusNum`,
    method: 'get'
  })
}

// 获取设备状态数量
export function updateInstanceStatus (data) {
  return request({
    url: `/device/client-device/updateStatus`,
    method: 'post',
    data: data
  })
}





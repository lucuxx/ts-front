import request from '@/utils/request'

// 查询网络组件列表
export function listGateway (data) {
  return request({
    url: '/device/device-gateway/listDeviceGatewayPage',
    method: 'post',
    data: data
  })
}

// 查询网络组件详细
export function getGateway (id) {
  return request({
    url: `/device/device-gateway/findById/${id}`,
    method: 'get'
  })
}

// 添加网络组件
export function addGateway (data) {
  return request({
    url: '/device/device-gateway/create',
    method: 'post',
    data: data
  })
}


// 修改网络组件
export function updateGateway (data) {
  return request({
    url: '/device/device-gateway/modify',
    method: 'post',
    data: data
  })
}

// 删除网络组件
export function delGateway (id) {
  return request({
    url: `/device/device-gateway/remove/${id}`,
    method: 'delete'
  })
}

// 启用网络组件
export function enableGateway (id) {
  return request({
    url: `/device/device-gateway/start/${id}`,
    method: 'put'
  })
}

// 停用网络组件
export function disableGateway (id) {
  return request({
    url: `/device/device-gateway/shutdown/${id}`,
    method: 'put'
  })
}









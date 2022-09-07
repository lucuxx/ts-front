import request from '@/utils/request'

// 查询网络组件列表
export function listType (data) {
  return request({
    url: '/device/network/listNetworkPage',
    method: 'post',
    data: data
  })
}

// 查询网络组件详细
export function getType (id) {
  return request({
    url: `/device/network/findById/${id}`,
    method: 'get'
  })
}

// 添加网络组件
export function addType (data) {
  return request({
    url: '/device/network/create',
    method: 'post',
    data: data
  })
}


// 修改网络组件
export function updateType (data) {
  return request({
    url: '/device/network/modify',
    method: 'post',
    data: data
  })
}

// 删除网络组件
export function delType (id) {
  return request({
    url: `/device/network/remove/${id}`,
    method: 'delete'
  })
}

// 启用网络组件
export function enableType (id) {
  return request({
    url: `/device/network/enable/${id}`,
    method: 'put'
  })
}

// 停用网络组件
export function disableType (id) {
  return request({
    url: `/device/network/disable/${id}`,
    method: 'put'
  })
}


// 查询网络组件下拉数据
export function getTypeOptions (query) {
  return request({
    url: `/device/network/selectNetwork`,
    method: 'get',
    params: query
  })
}






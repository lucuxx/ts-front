import request from '@/utils/request'

// 查询协议列表
export function listMessageCodec (data) {
  return request({
    url: '/device/messageCodec/listMessageCodecPage',
    method: 'post',
    data: data
  })
}

// 查询协议详细
export function getMessageCodec (id) {
  return request({
    url: `/device/messageCodec/findById/${id}`,
    method: 'get'
  })
}

// 添加协议
export function addMessageCodec (data) {
  return request({
    url: '/device/messageCodec/create',
    method: 'post',
    data: data
  })
}


// 修改协议
export function updateMessageCodec (data) {
  return request({
    url: '/device/messageCodec/modify',
    method: 'post',
    data: data
  })
}

// 删除协议
export function delMessageCodec (id) {
  return request({
    url: `/device/messageCodec/remove/${id}`,
    method: 'delete'
  })
}

// 协议下拉框
export function getMessageCodecOptions (query) {
  return request({
    url: `/device/messageCodec/selectMessageCodec`,
    method: 'get',
    params: query
  })
}


// 发布协议
export function deployMessageCodec (id) {
  return request({
    url: `/device/messageCodec/deploy/${id}`,
    method: 'put'
  })
}

// 取消发布协议
export function undeployMessageCodec (id) {
  return request({
    url: `/device/messageCodec/undeploy/${id}`,
    method: 'put'
  })
}

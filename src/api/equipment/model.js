import request from '@/utils/request'

// 查询物模型列表
export function listModel (data) {
  return request({
    url: '/device/pro-model/listProModelPage',
    method: 'post',
    data: data
  })
}

// 查询物模型详细
export function getModel (id) {
  return request({
    url: `/device/pro-model/findById/${id}`,
    method: 'get'
  })
}

// 添加物模型
export function addModel (data) {
  return request({
    url: '/device/pro-model/create',
    method: 'post',
    data: data
  })
}


// 修改物模型
export function updateModel (data) {
  return request({
    url: '/device/pro-model/modify',
    method: 'post',
    data: data
  })
}

// 删除物模型
export function delModel (id) {
  return request({
    url: `/device/pro-model/remove/${id}`,
    method: 'delete'
  })
}

// 属性物模型-----------------------------------------------
// 查询物模型列表
export function listModelProperty (data) {
  return request({
    url: '/device/pro-model-property/listProModelPropertyPage',
    method: 'post',
    data: data
  })
}

// 查询物模型详细
export function getModelProperty (id) {
  return request({
    url: `/device/pro-model-property/findById/${id}`,
    method: 'get'
  })
}

// 添加物模型
export function addModelProperty (data) {
  return request({
    url: '/device/pro-model-property/create',
    method: 'post',
    data: data
  })
}


// 修改物模型
export function updateModelProperty (data) {
  return request({
    url: '/device/pro-model-property/modify',
    method: 'post',
    data: data
  })
}

// 删除物模型
export function delModelProperty (id) {
  return request({
    url: `/device/pro-model-property/remove/${id}`,
    method: 'delete'
  })
}


// 事件物模型--------------------------------------------------
// 查询物模型列表
export function listModelEvent (data) {
  return request({
    url: '/device/pro-model-event/listProModelEventPage',
    method: 'post',
    data: data
  })
}

// 查询物模型详细
export function getModelEvent (id) {
  return request({
    url: `/device/pro-model-event/findById/${id}`,
    method: 'get'
  })
}

// 添加物模型
export function addModelEvent (data) {
  return request({
    url: '/device/pro-model-event/create',
    method: 'post',
    data: data
  })
}


// 修改物模型
export function updateModelEvent (data) {
  return request({
    url: '/device/pro-model-event/modify',
    method: 'post',
    data: data
  })
}

// 删除物模型
export function delModelEvent (id) {
  return request({
    url: `/device/pro-model-event/remove/${id}`,
    method: 'delete'
  })
}

// 服务物模型--------------------------------------------------

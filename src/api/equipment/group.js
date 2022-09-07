import request from '@/utils/request'

// 查询设备列表
export function listGroup (data) {
  return request({
    url: '/device/client-group/listClientGroupPage',
    method: 'post',
    data: data
  })
}

// 查询设备详细
export function getGroup (id) {
  return request({
    url: `/device/client-group/findById/${id}`,
    method: 'get'
  })
}

// 添加设备
export function addGroup (data) {
  return request({
    url: '/device/client-group/create',
    method: 'post',
    data: data
  })
}


// 修改设备
export function updateGroup (data) {
  return request({
    url: '/device/client-group/modify',
    method: 'post',
    data: data
  })
}

// 删除设备
export function delGroup (id) {
  return request({
    url: `/device/client-group/remove/${id}`,
    method: 'delete'
  })
}

// 下拉数据
export function listGroupOptions (data) {
  return request({
    url: '/device/client-group/listGroupBox',
    method: 'post',
    data: data
  })
}

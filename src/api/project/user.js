import request from '@/utils/request'

// 项目关联人员列表
export function
  allocatedProjectUserList (data) {
  return request({
    url: '/project/allocatedList',
    method: 'post',
    data: data
  })
}

// 项目未关联人员列表
export function
  unAllocatedProjectUserList (data) {
  return request({
    url: '/project/unallocatedList',
    method: 'post',
    data: data
  })
}



// 批量添加项目关联人员
export function
  selectUser (data) {
  return request({
    url: '/project/selectUser',
    method: 'post',
    data: data
  })
}


// 批量取消项目关联人员
export function
  cancelAll (data) {
  return request({
    url: '/project/cancelAll',
    method: 'post',
    data: data
  })
}

// 单个取消关联人员
export function
  cancel (data) {
  return request({
    url: '/project/cancel',
    method: 'put',
    data: data
  })
}




import request from '@/utils/request'

// 查询项目列表
export function listProject (query) {
  return request({
    url: '/project/list',
    method: 'get',
    params: query
  })
}

// 查询项目详细
export function getProject (id) {
  return request({
    url: `/project/${id}`,
    method: 'get'
  })
}

// 添加项目
export function addProject (data) {
  return request({
    url: '/project/create',
    method: 'post',
    data: data
  })
}


// 修改项目
export function updateProject (data) {
  return request({
    url: '/project/update',
    method: 'put',
    data: data
  })
}

// 删除项目
export function delProject (id) {
  return request({
    url: `/project/${id}`,
    method: 'delete'
  })
}

// 项目下拉框
export function listProjectOptions (data) {
  return request({
    url: '/project/listProjectBox',
    method: 'post',
    data: data
  })
}

// 更新项目状态
export function updateProjectStatus (data) {
  return request({
    url: '/project/updateStatus',
    method: 'post',
    data: data
  })
}









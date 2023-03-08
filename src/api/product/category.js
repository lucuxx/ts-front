import request from '@/utils/request'

// 查询产品分类列表
export function listCategory (query) {
  return request({
    url: '/category/list',
    method: 'get',
    params: query
  })
}

// 查询产品分类详细
export function getCategory (id) {
  return request({
    url: `/category/${id}`,
    method: 'get'
  })
}

// 添加产品分类
export function addCategory (data) {
  return request({
    url: '/category/create',
    method: 'post',
    data: data
  })
}


// 修改产品分类
export function updateCategory (data) {
  return request({
    url: '/category/update',
    method: 'put',
    data: data
  })
}

// 删除产品分类
export function delCategory (id) {
  return request({
    url: `/category/${id}`,
    method: 'delete'
  })
}

// 产品分类下拉框
export function listCategoryOptions (data) {
  return request({
    url: '/category/listCategoryOptions',
    method: 'post',
    data: data
  })
}









import request from '@/utils/request'

// 查询证书列表
export function listCertificate (data) {
  return request({
    url: '/device/certificate/listCertificatePage',
    method: 'post',
    data: data
  })
}

// 查询证书详细
export function getCertificate (id) {
  return request({
    url: `/device/certificate/findById/${id}`,
    method: 'get'
  })
}

// 添加证书
export function addCertificate (data) {
  return request({
    url: '/device/certificate/create',
    method: 'post',
    data: data
  })
}


// 修改证书
export function updateCertificate (data) {
  return request({
    url: '/device/certificate/modify',
    method: 'post',
    data: data
  })
}

// 删除证书
export function delCertificate (id) {
  return request({
    url: `/device/certificate/remove/${id}`,
    method: 'delete'
  })
}


// 查询证书下拉数据
export function getCertificateOptions (query) {
  return request({
    url: `/device/certificate/selectCertificate`,
    method: 'get',
    params: query
  })
}


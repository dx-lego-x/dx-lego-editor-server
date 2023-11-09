export const workErrorMessages = {
  workControlWithoutUserInfo: {
    errno: 102001,
    message: '请先登录'
  },

  workPermissonCheckFail: {
    errno: 102002,
    message: '无权限操作当前作品'
  },

  workNotExisted: {
    errno: 102003,
    message: '作品查询失败或不存在'
  },

  workParamsError: {
    errno: 102004,
    message: '作品参数错误'
  },

  workUnknownError: {
    errno: 102005,
    message: '未知错误',
  },

  channelValidateFail: {
    errno: 102006,
    message: '频道输入信息验证失败',
  },

  channelOperateFail: {
    errno: 102007,
    message: '频道操作失败，当前作品不存在或无权限',
  }
}

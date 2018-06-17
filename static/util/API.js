const prefix = location.origin


export default {
    test: prefix + '/test',
    login: prefix + '/login',
    logout: prefix + '/logout',
    isLogin: prefix + '/isLogin',

    getFileInfo: prefix + '/getFileInfo',
    changeFileStatus: prefix + '/changeFileStatus',
    getFileOp: prefix + '/getFileOp',

    getUserInfo: prefix + '/getUserInfo',
    changeUserStatus: prefix + '/changeUserStatus',
    getUserDetail: prefix + '/getUserDetail',

    getUsername: prefix + '/getUsername',
    getNoticeInfo: prefix + '/getNoticeInfo',
    sendNotice: prefix + '/sendNotice',
    deleteNoticeInfo: prefix + '/deleteNoticeInfo',
    modifyNotice: prefix + '/modifyNotice',

    getAuthUserInfo: prefix + '/getAuthUserInfo',
    changeAuth: prefix + '/changeAuth',
    verifyLogin: prefix + '/verifyLogin',

    addActivity: prefix + '/addActivity',
    deleteActivity: prefix + '/deleteActivity',
    modifyActivity: prefix + '/modifyActivity',
    getActivity: prefix + '/getActivity',

    getLogs: prefix + '/getLogs',

    collectRecord: prefix + '/collectRecord',

    getUserTime: prefix + '/getUserTime',
    getAllUserTime: prefix + '/getAllUserTime',
    getUserHasTime: prefix + '/getUserHasTime',

    getCourse: prefix + '/getCourse',
    addCourse: prefix + '/addCourse',
    modifyCourse: prefix + '/modifyCourse',
    deleteCourse: prefix + '/deleteCourse',
    getMajor: prefix + '/getMajor'
}

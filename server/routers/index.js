const router = require('koa-router')();
const login = require('./../controller/login');
const isLogin = require('./../controller/isLogin');
const logout = require('./../controller/logout');
const fileInfo = require('./../controller/fileInfo');
const userInfo = require('./../controller/userInfo');
const noticeInfo = require('./../controller/noticeInfo');
const userAuth = require('./../controller/userAuth');
const activity = require('./../controller/activity');
const loginLogs = require('./../controller/loginLogs');
const record = require('./../controller/record')
const { getUserTime, getAllUserTime, getUserHasTime } = require('./../controller/getUserTime')
const { getCourse, addCourse, modifyCourse, deleteCourse, getMajor } = require('./../controller/course')


router.post('/isLogin', isLogin)
router.get('/logout', logout)
router.post('/login', login)

router.get('/getFileInfo', fileInfo.getFileInfo)
router.get('/getFileOp', fileInfo.getFileOp)
router.post('/changeFileStatus', fileInfo.changeFileStatus)

router.get('/getUserInfo', userInfo.getUserInfo)
router.get('/getUserDetail', userInfo.getUserDetail)
router.post('/changeUserStatus', userInfo.changeUserStatus)

router.get('/getUsername', noticeInfo.getUsername)
router.get('/getNoticeInfo', noticeInfo.getNoticeInfo)
router.post('/sendNotice', noticeInfo.sendNotice)
router.delete('/deleteNoticeInfo', noticeInfo.deleteNoticeInfo)
router.put('/modifyNotice', noticeInfo.modifyNotice)

router.get('/getAuthUserInfo', userAuth.getAuthUserInfo)
router.put('/changeAuth', userAuth.changeAuth)
router.post('/verifyLogin', userAuth.verifyLogin)

router.get('/getActivity', activity.getActivity)
router.delete('/deleteActivity', activity.deleteActivity)
router.put('/modifyActivity', activity.modifyActivity)
router.post('/addActivity', activity.addActivity)

router.get('/getLogs', loginLogs.getLogs)

router.post('/collectRecord', record.collectRecord)

router.get('/getUserTime', getUserTime)
router.get('/getAllUserTime', getAllUserTime)
router.get('/getUserHasTime', getUserHasTime)


router.get('/getCourse', getCourse)
router.post('/addCourse', addCourse)
router.delete('/deleteCourse', deleteCourse)
router.put('/modifyCourse', modifyCourse)
router.get('/getMajor', getMajor)


module.exports = router;
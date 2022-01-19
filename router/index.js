const Router = require('express').Router;
const userController = require('../controllers/user-cotroller')
const fileController = require('../controllers/file-controller')
const router = new Router();
const authoMiddleware = require('../middlewares/auth-middleware');
const { body } = require('express-validator');


router.post('/signup',
    body('password').isLength({min: 3, max: 32}),
    userController.signup
);//регистрация нового пользователя;
router.post('/signin', userController.signin);//запрос bearer токена по id и паролю; Поля id и password, id это номер телефона или email;
router.get('/new_token', userController.refresh);//обновление bearer токена по refresh токену
router.post('/logout', userController.logout);//выйти из системы;


router.get('/info', 
    authoMiddleware,
    userController.getUser
);//возвращает id пользователя;
router.post('/file/upload', 
    authoMiddleware,
    fileController.getUpload
);//добавление нового файла в систему и запись параметров файла в базу: название, расширение, MIME type, размер, дата загрузки;
router.get('/file/list/:list_size/:page',
    authoMiddleware,
    fileController.getList
);
router.get('/file/list',
    authoMiddleware,
    fileController.getList
);//выводит список файлов и их параметров из базы с использованием пагинации с размером страницы, указанного в передаваемом параметре list_size, по умолчанию 10 записей на страницу, если параметр пустой.Номер страницы указан в параметре page, по умолчанию 1, если не задан; 
router.get('/file/:id',
    authoMiddleware,
    fileController.getFile
);//вывод информации о выбранном файле;
router.get('/file/download/:id',
    authoMiddleware,
    fileController.getDownload
);//скачивание конкретного файла;
router.put('/file/update/:id', 
    authoMiddleware,
    fileController.putUpdate
);//обновление текущего документа на новый в базе и локальном хранилище;
router.delete('/file/delete/:id',
    authoMiddleware,
    fileController.delDelete
);//удаляет документ из базы и локального хранилища;

module.exports = router
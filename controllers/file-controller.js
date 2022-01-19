const fileService = require('../service/file-service');
const ApiErrors = require('../exceptions/api-error');
const FileDto = require('../dtos/file-dto');

class fileController {
    async getUpload(req, res, next) {
        try {
            const file = req.file;
            console.log('file', file);
            const { refreshToken } = req.cookies;

            if (!file)
                throw ApiErrors.BedRequest(`Ошибка при загрузке файла`);

            const fileData = await fileService.saveFile(refreshToken, file);
            const filedata = new FileDto(fileData);
            return res.json(filedata);
        } catch (e) {
            next(e);
        }
    }
    async getList(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const list_size = (req.params.list_size | req.query.list_size) || 10;
            const page = (req.params.page | req.query.page) || 1;
            const files = await fileService.getAllFile(list_size, page, refreshToken);

            res.json(files)
        } catch (e) {
            next(e);
        }
    }
    async getFile(req, res, next) {
        try {
            const idFile = req.params.id;
            const fileData = await fileService.getFile(idFile);
            const fileDto = new FileDto(fileData);
            res.json(fileDto)
        } catch (e) {
            next(e);
        }
    }
    async getDownload(req, res, next) {
        try {
            const idFile = req.params.id;
            const fileData = await fileService.getFile(idFile);
            const fileDto = new FileDto(fileData);
            const fileLink = `./uploads//${fileDto.originalname}`;

            res.download(fileLink);
        } catch (e) {
            next(e);
        }
    }
    async putUpdate(req, res, next) {
        try {
            const idFile = req.params.id;
            const file = req.file;
            if (!file)
                throw ApiErrors.BedRequest(`Ошибка при загрузке файла`);

            const fileData = await fileService.updateFile(idFile, file);
            const fileDto = new FileDto(fileData);

            res.json(fileDto);
        } catch (e) {
            next(e);
        }
    }
    async delDelete(req, res, next) {
        try {
            const idFile = req.params.id;
            const fileDeleteData = await fileService.delateDataFile(idFile);
            res.json(fileDeleteData);
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new fileController;
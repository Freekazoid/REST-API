const multer = require("multer");
const path = require('path');
const fileModel = require('../models/file-model');
const userService = require('../service/user-service');
const fs = require('fs/promises');
const ApiErrors = require('../exceptions/api-error');

class FileService {
	nameFile;
	setNameFile = (name) => {
			this.nameFile = Date.now() + '-' + name.originalname
	}
	storageConfig = multer.diskStorage({
		limits: {
			fileSize: 10000000
		},
		destination: 'uploads',
		filename: (req, file, cb) => {
			this.setNameFile(file)
			cb(null, this.nameFile)
		}
	})
	fileFilter(req, file, cb) {;
		cb(null, true);
		// if (file.mimetype === "image/png" ||
		// 	file.mimetype === "image/jpg" ||
		// 	file.mimetype === "application/msword" ||
		// 	file.mimetype === "application/pdf" ||
		// 	file.mimetype === "image/xml") {
		// 	cb(null, true);
		// }
		// else {
		// 	cb(null, false);
		// }
	}

	async saveFile(refreshToken, filedata) {
			const userData = await userService.getUser(refreshToken);
			const fileData = await fileModel.create({
					user: userData.id,
					name: filedata.originalname.split('.')[0],
					extension: path.extname(filedata.originalname),
					originalname: this.nameFile,
					type: filedata.mimetype,
					size: filedata.size
			});
			return fileData;
	}
	async getAllFile(list_size, page, refreshToken) {
		const userData = await userService.getUser(refreshToken);
		const files = await fileModel.find({user: userData._id}).skip(list_size * page - list_size).limit(list_size);
		return files
	}
	async getFile(id) {
		const file = await fileModel.findById(id);
		return file;
	}
	async deleteFiles(id){
		const delfile = await fileModel.findById(id, (e, data) => {
			if (!data) return;
			fs.unlink('./uploads/' + data.originalname, (err) => {
				if (e) throw ApiErrors.BedRequest(`Ошибка при удалении файла`);
				return data
			});
		}).clone().catch(function (err) { console.log(err) })
		return delfile;
	}
	async updateFile(id, filedata) {
		this.deleteFiles(id);
		const file = await fileModel.findByIdAndUpdate(
			id,
			{
				$set: {
					name: filedata.originalname.split('.')[0],
					extension: path.extname(filedata.originalname),
					originalname: this.nameFile,
					type: filedata.mimetype,
					size: filedata.size,
					date: Date.now()
				} 
			}, 
			{ new: true }
		);
		return file;
	}
	async delateDataFile(id){
		const deleteFile = await this.deleteFiles(id);
		if (deleteFile)
			return await fileModel.findByIdAndDelete(id);
		else
			throw ApiErrors.BedRequest(`Ошибка нет такого файла`);
}
}
module.exports = new FileService(); 

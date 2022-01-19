module.exports = class FileDTO {
    id;
    name;
    originalname;
    extension;
    type;
    size;
    date;

    constructor(model) {
        this.id = model._id;
        this.name = model.name;
        this.originalname = model.originalname;
        this.extension = model.extension;
        this.type = model.type;
        this.size = model.size;
        this.date = model.date;
    }
};
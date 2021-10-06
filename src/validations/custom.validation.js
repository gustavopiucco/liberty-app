const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message('A senha precisa ter no mínimo 8 caracteres');
    }

    if (value.length > 50) {
        return helpers.message('A senha precisa ter no máximo 50 caracteres');
    }

    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message('A senha precisa conter pelo menos 1 letra e 1 número');
    }

    return value;
};

const date = (value, helpers) => {
    const date = new Date(value);

    if (!(date instanceof Date) || isNaN(date)) {
        return helpers.message('Formato de data inválido');
    }

    return value;
};

module.exports = {
    password,
    date
}
function sqlBuilder(tableName, fieldsObject, whereField, whereValue) {
    let sqlFields = '';
    let sql = '';

    let fields = Object.keys(fieldsObject);
    let values = Object.values(fieldsObject);

    values.push(whereValue);

    for (let i = 0; i < fields.length; i++) {
        sqlFields += fields[i] + ' = ?';

        if (i == fields.length - 1) {
            sqlFields += ''
        }
        else {
            sqlFields += ', '
        }
    }

    sql = `UPDATE ${tableName} SET ${sqlFields} WHERE ${whereField} = ?`;

    return {
        sql,
        values
    }
}

module.exports = {
    sqlBuilder
}
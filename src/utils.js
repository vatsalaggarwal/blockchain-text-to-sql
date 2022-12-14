import loarray from 'lodash/array';
import lostring from 'lodash/string';

export function parseParametrisedQuery(query, params) {
    if (!params || !query) return;

    let newQuery = query;
    Object.keys(params).forEach((k, _) => {
        newQuery = loarray.join(lostring.split(newQuery, `{{${params[k].name}}}`), ` ${params[k].value} `);
    })

    return newQuery;
}

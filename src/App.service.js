import {TRANSACTION_URL} from './config';

export const getTransactions = (page) => {
    return fetch(`${TRANSACTION_URL}/${page}.json`)
    .then(response => response.json())
    .then(responseJson => responseJson)
    .catch(err => console.log(err));
}
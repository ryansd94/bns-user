

import Moment from 'moment';
export const formatDate = (value) => {
    return Moment(value).format('DD-MM-YYYY HH:mm');
};
export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
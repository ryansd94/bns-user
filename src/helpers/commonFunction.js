

import Moment from 'moment';
export const formatDate = (value) => {
    return Moment(value).format('DD-MM-YYYY HH:mm');
};
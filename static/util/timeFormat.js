import dayjs from 'dayjs';

export default function format(time) {
    if (time === undefined) {
        return dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}
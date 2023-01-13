// Config
import config from '../config';

// Utils
import fetchData from './fetchData';
import { getColor } from './generateChartColor';

const fetchCategory = async (query) => {
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
        next: {
            revalidate: 100000000000
        }
    };

    const res = await fetch(`${config.apiUrl}category`, request);
    const data = await res.json();

    if (data?.type === 'verbatim') {
        return {
            isVerbatim: true,
            ...data
        }
    }

    const sorted = Object.keys(data.values)
        .sort()
        .reduce((obj, key) => {
            obj[key] = data.values[key];
            return obj;
        }, {});

    const formattedData = [
        {
            type: 'bar',
            orientation: 'h',
            x: Object.values(sorted),
            y: Object.keys(sorted),
            text: Object.keys(sorted).map(
                (key) => `${data.column}: ${key} ${data.message || ''}`
            ),
            marker: {
                color: Object.keys(sorted).map(getColor),
            },
        }
    ];



    return formattedData;
}


export default fetchCategory;

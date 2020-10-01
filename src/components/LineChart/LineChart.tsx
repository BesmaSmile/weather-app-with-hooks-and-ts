import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

interface Props {
    labels: any
    datasets: any
    title: any
}

const LineChart: React.FC<Props> = ({ labels, datasets, title }) => {
    const options = {
        legend: {
            display: datasets.length > 1,
            position: 'bottom'
        },
        title: {
            display: true,
            text: title,
            fontSize: 25,
            fontColor: '#B43E5A',
            fontStyle: undefined
        },
        plugins: {
            datalabels: {
                display: true,
                color: '#B43E5A',
                backgroundColor: '#ccc',
                opacity: 0.7,
                borderRadius: 3,
                align: 'top',
            }
        }
    }
    const chartOptions = {
        fill: false,
        lineTension: 0.2,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderWidth: 6,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        pointBorderColor: '#B43E5A',
        pointBackgroundColor: '#B43E5A',
        pointHoverBackgroundColor: 'rgba(220,220,220,1)',
        pointHoverBorderColor: '#B43E5A',
    }
    const data = {
        labels: labels,
        datasets: datasets.map((dataset: any) => ({ ...dataset, ...chartOptions }))
    }
    return (
        <Line ref="chart" data={data} options={options} />
    )
}

export default LineChart
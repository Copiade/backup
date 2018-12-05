'use strict';

google.charts.load('current', {'packages': ['line']});

var materialOptions = {
    chart: {
        title: 'Temperatura e Umidade'
    },
    width: 800,
    height: 400,
    series: {
        0: {
            axis: 'temperatura',
            color: '#FF0000'
        },
        1: {
            axis: 'umidade',
            color: '#0000FF'
        }
    },
    axes: {
        y: {
            temperatura: {
                label: 'Temperatura'
            },
            umidade: {
                label: 'Umidade'
            }
        }
    }
};

google.charts.setOnLoadCallback(() => {
    chart = new google.charts.Line(document.getElementById('chart_div'));
    loadData();
    setInterval(loadData, 2500);
});

var chart;

function drawChart(data) {
    chart.draw(data, materialOptions);
}

function loadData() {
    $.ajax({
        cache: false,
        method: "get",
        url: "/leitura/dt",
        success: function (data) {
            var dataTable = new google.visualization.DataTable(data);
            console.log(dataTable);
            drawChart(dataTable);
        },
        error: function (e) {
            console.log("Error:", e);
        }
    });
}

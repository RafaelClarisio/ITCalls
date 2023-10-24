import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import './style.css';

const Metricas = () => {
  const [chamadosVencidos, setChamadosVencidos] = useState([]);
  const [chamadosNaoVencidos, setNaoChamadosVencidos] = useState([]);

  useEffect(() => {
    // Fazer uma solicitação HTTP GET para obter os detalhes dos chamados
    fetch('http://200.216.165.199:51000/requests')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao obter os detalhes dos chamados');
        }
        return response.json();
      })
      .then((data) => {
        const chamadosFechadosVencidos = data.filter((chamado) => {
          return chamado.status === 'Fechado' && new Date(chamado.data_fechamento) > new Date(chamado.data_previsao);
        });
        const chamadosNaoVencidos = data.filter((chamado) => {
          return chamado.status === 'Fechado' && new Date(chamado.data_fechamento) < new Date(chamado.data_previsao);
        });
        setChamadosVencidos(chamadosFechadosVencidos);
        setNaoChamadosVencidos(chamadosNaoVencidos);
      })
      .catch((error) => {
        console.error('Erro ao obter os detalhes dos chamados:', error);
      });
  }, []);

  const totalChamados = chamadosVencidos.length + chamadosNaoVencidos.length;
  const percentualNaoVencidos = (chamadosNaoVencidos.length / totalChamados) * 100;

  // Configurações do gráfico ApexCharts
  const chartOptions = {
    series: [percentualNaoVencidos.toFixed(2)], // Percentual de Chamados Não Vencidos
    chart: {
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '17px',
          },
          value: {
            formatter: function (val) {
              return parseFloat(val).toFixed(2) + '%';
            },
            color: '#111',
            fontSize: '36px',
            show: true,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ABE5A1'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['SLA'],
  };

  return (
    <div className="Metricas_body">
      <div className="Metricas_grid">
        <div className="Metricas1">
          <p>Total de Chamados Vencidos: {chamadosVencidos.length}</p>
          <p>Total de Chamados Não Vencidos: {chamadosNaoVencidos.length}</p>
          <p>Percentual de Chamados Não Vencidos: {percentualNaoVencidos.toFixed(2)}%</p>
          <ReactApexChart options={chartOptions} series={chartOptions.series} type="radialBar" height={chartOptions.chart.height} />
        </div>
        <div className="Metricas2"> </div>
        <div className="Metricas3"> </div>
        <div className="Metricas4"> </div>
        <div className="Metricas5"> </div>
        <div className="Metricas6"> </div>
      </div>
    </div>
  );
};

export default Metricas;

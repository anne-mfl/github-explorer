import React from 'react'
import { useGithubContext } from 'context/GithubContext'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ContributionRadar = () => {

  const { contributions } = useGithubContext()

  // const data = {
  //   labels: ['Code review', 'Issues', 'Pull requests', 'Commits'],
  //   datasets: [{
  //     data: [
  //       contributions?.totalPullRequestReviewContributions || 0,
  //       contributions?.totalIssueContributions || 0,
  //       contributions?.totalPullRequestContributions || 0,
  //       contributions?.totalCommitContributions || 0
  //     ],
  //     backgroundColor: 'rgb(64, 196, 99)',
  //     borderColor: 'rgb(64, 196, 99)',
  //     borderWidth: 1
  //   }]
  // }

  const data = {
    labels: ['Code review', 'Issues', 'Pull requests', 'Commits'],
    datasets: [{
      data: [
        contributions?.totalPullRequestReviewContributions || 0,
        contributions?.totalIssueContributions || 0,
        contributions?.totalPullRequestContributions || 0,
        contributions?.totalCommitContributions || 0
      ],
      // backgroundColor: 'rgba(64, 196, 99, 0.2)', // semi-transparent fill
      // borderColor: 'rgb(64, 196, 99)',            // outline
      borderWidth: 0,
      // borderColor: 'red',
      backgroundColor:  'rgb(64, 196, 99, 0.5)',
      pointBackgroundColor: 'white',   // point dots
      pointBorderColor: 'rgb(17, 99, 41)',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgb(64, 196, 99)',
      pointBorderWidth: 2,
      pointRadius: 3, 
      pointHoverRadius: 5
    }]
  }


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // GitHub doesn't show legend
      },
      // tooltip: {
      //   backgroundColor: 'rgba(0, 0, 0, 0.8)',
      //   titleColor: '#ffffff',
      //   bodyColor: '#ffffff',
      //   borderColor: '#40c463',
      //   borderWidth: 1,
      // }
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: 'transparent', // Light gray grid lines
          lineWidth: 1,
        },
        angleLines: {
          color: 'rgb(17, 99, 41)', // Light gray angle lines
          lineWidth: 2.5,
          borderRadius: 5,
        },
        pointLabels: {
          color: '#586069', // GitHub's text color
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif'
          },
          padding: 20,
        },
        ticks: {
          display: false, // Hide the number labels on the radial axis
          stepSize: 1,
        }
      }
    },
    elements: {
      line: {
        tension: 0.1 // Slight curve to the lines
      }
    }
  }



  return (
    <div>
      Radar
      <br />
      Issue: {contributions && contributions.totalIssueContributions}
      <br />
      Pull Request: {contributions && contributions.totalPullRequestContributions}
      <br />
      Commit: {contributions && contributions.totalCommitContributions}
      <br />
      Review: {contributions && contributions.totalPullRequestReviewContributions}

      <div style={{ width: '234px', height: '196px' }}>
        <Radar data={data} options={options} />
      </div>

    </div>
  )
}

export default ContributionRadar
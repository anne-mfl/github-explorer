import React from 'react'
import { useGithubContext } from 'context/GithubContext'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { Radar } from 'react-chartjs-2'

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

  const contributionTotal =
    contributions?.totalCommitContributions +
    contributions?.totalIssueContributions +
    contributions?.totalPullRequestContributions +
    contributions?.totalPullRequestReviewContributions || 0;

  const commitPercentage = contributions?.totalCommitContributions ? (contributions.totalCommitContributions / contributionTotal * 100).toFixed(0) : 0;
  const issuePercentage = contributions?.totalIssueContributions ? (contributions.totalIssueContributions / contributionTotal * 100).toFixed(0) : 0;
  const pullRequestPercentage = contributions?.totalPullRequestContributions ? (contributions.totalPullRequestContributions / contributionTotal * 100).toFixed(0) : 0;
  const reviewPercentage = contributions?.totalPullRequestReviewContributions ? (contributions.totalPullRequestReviewContributions / contributionTotal * 100).toFixed(0) : 0;

  const data = {
    labels: [
      `${reviewPercentage !== 0 ? `${reviewPercentage}%\nCode review` : 'Code review'}`, 
      `${issuePercentage !== 0 ? `${issuePercentage}%  Issues` : 'Issues'}`, 
      `${pullRequestPercentage !== 0 ? `${pullRequestPercentage}%  Pull requests` : 'Pull requests'}`, 
      `${commitPercentage !== 0 ? `${commitPercentage}%  Commits` : 'Commits'}`
    ],
    datasets: [{
      data: [
        contributions?.totalPullRequestReviewContributions || 0,
        contributions?.totalIssueContributions || 0,
        contributions?.totalPullRequestContributions || 0,
        contributions?.totalCommitContributions || 0
      ],
      // backgroundColor: 'rgba(64, 196, 99, 0.2)', // semi-transparent fill
      // borderColor: 'rgb(64, 196, 99)',            // outline
      borderWidth: 7,
      borderColor: 'rgb(64, 196, 99, 0.5)',
      backgroundColor: 'rgb(64, 196, 99, 0.5)',
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
          // borderCapStyle: 'round', // Rounded caps
        },
        pointLabels: {
          color: '#586069', // GitHub's text color
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif'
          },
          padding: 10,
        },
        ticks: {
          display: false, // Hide the number labels on the radial axis
          stepSize: 1,
        },
      }
    },
    elements: {
      line: {
        tension: 0.1, // Slight curve to the lines
      },
     
    }
  }


  return (
    <div className='p-4 flex-auto'>

      <div style={{ width: '300px', height: '200px' }}>
        <Radar data={data} options={options} />
      </div>

    </div>
  )
}

export default ContributionRadar
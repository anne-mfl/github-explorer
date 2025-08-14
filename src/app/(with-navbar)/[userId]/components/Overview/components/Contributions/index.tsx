import React from 'react'
import Heatmap from './components/ContributionHeatmap'
import YearSelectionBar from './components/YearSelectionBar'
import Radar from './components/ContributionRadar'

const ContributionsIndex = () => {
  return (
    <div className='flex'>
      <div>
        <Heatmap />
        <Radar />
      </div>
      <YearSelectionBar />
    </div>
  )
}

export default ContributionsIndex
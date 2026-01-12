import React from 'react'
import Risksegmentation from '../../ui/risk-segmentation/risksegmentation'

const RisksSegmentation = () => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('current_page', 'risk-segmentation');
        localStorage.setItem('risk-segmentation_page_loaded', 'true');
    }
  return (
    <Risksegmentation />
  )
}

export default RisksSegmentation
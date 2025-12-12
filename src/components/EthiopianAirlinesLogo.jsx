import './EthiopianAirlinesLogo.css'
import { useState, useEffect } from 'react'

const EthiopianAirlinesLogo = ({ className = '' }) => {
  const [imageError, setImageError] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Try multiple possible image paths/formats
  const imagePaths = [
    '/ethiopian-airlines-logo.png',
    '/ethiopian-airlines-logo.jpg',
    '/ethiopian-airlines-logo.svg',
    '/ethiopian-logo.png',
    '/ethiopian-logo.jpg',
    '/logo.png',
    '/logo.jpg'
  ]

  const handleImageError = (e) => {
    if (currentImageIndex < imagePaths.length - 1) {
      // Try next image
      setCurrentImageIndex(currentImageIndex + 1)
    } else {
      // All images failed, show fallback
      setImageError(true)
      e.target.style.display = 'none'
    }
  }

  // Reset when component mounts
  useEffect(() => {
    setImageError(false)
    setCurrentImageIndex(0)
  }, [])

  if (imageError) {
    // Show fallback with Ethiopian Airlines branding
    return (
      <div className={`ethiopian-airlines-logo ${className}`}>
        <div className="logo-image-container">
          <div className="logo-fallback">
            <div className="logo-main">
              <div className="logo-wing">
                <div className="wing-segment green"></div>
                <div className="wing-segment yellow"></div>
                <div className="wing-segment red"></div>
              </div>
              <div className="logo-text-container">
                <span className="logo-text">Ethiopian</span>
                <span className="logo-amharic">ኢትዮጵያ</span>
              </div>
            </div>
            <div className="logo-separator"></div>
            <div className="logo-alliance">
              <span className="alliance-text">A STAR ALLIANCE MEMBER</span>
              <div className="star-alliance-star">★</div>
              <span className="trademark">™</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`ethiopian-airlines-logo ${className}`}>
      <div className="logo-image-container">
        <img 
          src={imagePaths[currentImageIndex]}
          alt="Ethiopian Airlines - A Star Alliance Member"
          className="logo-image"
          onError={handleImageError}
          onLoad={() => {
            // Image loaded successfully
            setImageError(false)
          }}
        />
      </div>
    </div>
  )
}

export default EthiopianAirlinesLogo

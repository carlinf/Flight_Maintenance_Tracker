import './RwandAirLogo.css'

const RwandAirLogo = ({ className = '' }) => {
  return (
    <div className={`rwandair-logo ${className}`}>
      <svg 
        width="200" 
        height="50" 
        viewBox="0 0 200 50" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Modern RwandAir Logo Design */}
        <g>
          {/* Stylized R - Modern geometric design */}
          <path 
            d="M8 8 L8 42 L18 42 L18 28 L24 28 L30 34 L36 34 L30 22 L36 8 L24 8 L18 18 L18 8 Z" 
            fill="white"
          />
          <path 
            d="M18 18 L24 18 L30 8 L24 8 Z" 
            fill="white"
          />
          
          {/* Wing/Arrow element - represents flight */}
          <path 
            d="M42 25 L50 15 L54 19 L50 25 L54 31 L50 35 L42 25 Z" 
            fill="white"
            opacity="0.95"
          />
          
          {/* RwandAir Brand Text */}
          <text 
            x="62" 
            y="28" 
            fill="white" 
            fontSize="22" 
            fontWeight="700" 
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            letterSpacing="1.5px"
          >
            RwandAir
          </text>
          
          {/* Subtitle */}
          <text 
            x="62" 
            y="40" 
            fill="white" 
            fontSize="9" 
            fontWeight="500" 
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            opacity="0.85"
            letterSpacing="2px"
          >
            MAINTENANCE DASHBOARD
          </text>
        </g>
      </svg>
    </div>
  )
}

export default RwandAirLogo


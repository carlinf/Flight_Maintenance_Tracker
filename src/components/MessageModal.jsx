import './MessageModal.css'

const MessageModal = ({ isOpen, onClose, message, title = 'Message' }) => {
  if (!isOpen) return null

  return (
    <div className="message-modal-overlay" onClick={onClose}>
      <div className="message-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="message-modal-header">
          <h3>{title}</h3>
        </div>
        <div className="message-modal-body">
          <p>{message}</p>
        </div>
        <div className="message-modal-actions">
          <button className="message-btn-ok" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageModal

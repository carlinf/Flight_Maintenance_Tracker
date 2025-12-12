import './ConfirmationModal.css'

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message, title = 'Confirm Action' }) => {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="confirmation-modal-overlay" onClick={onClose}>
      <div className="confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-modal-header">
          <h3>{title}</h3>
        </div>
        <div className="confirmation-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirmation-modal-actions">
          <button className="confirmation-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="confirmation-btn-confirm" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal

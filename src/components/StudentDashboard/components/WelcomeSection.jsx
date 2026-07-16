import styles from '../styles'

const WelcomeSection = ({
  studentPhotoState,
  initials,
  studentName,
  isReadOnly,
  openProfileMenu,
  toggleProfileMenu,
  onChoosePhoto,
  onRemovePhoto,
  onProfilePhotoChange,
  photoInputRef,
}) => {
  return (
    <div style={styles.welcomeBox}>
      <div style={{ position: 'relative' }}>
        <div
          style={{ ...styles.welcomeAvatar, cursor: isReadOnly ? 'default' : 'pointer' }}
          onClick={() => !isReadOnly && toggleProfileMenu()}
        >
          {studentPhotoState ? (
            <img src={studentPhotoState} alt={studentName} style={styles.welcomeAvatarImage} />
          ) : (
            initials
          )}
        </div>

        {!isReadOnly && openProfileMenu && (
          <div style={{ ...styles.habitMenuDropdown, top: '58px', left: 0, right: 'auto' }}>
            <button style={styles.habitMenuItem} onClick={onChoosePhoto}>
              📷 Cambiar foto
            </button>
            {studentPhotoState && (
              <button style={styles.habitMenuItemDanger} onClick={onRemovePhoto}>
                Quitar foto
              </button>
            )}
          </div>
        )}

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onProfilePhotoChange}
        />
      </div>

      <div>
        <p style={styles.welcomeTitle}>Hola, {studentName} 👋</p>
        <p style={styles.welcomeSub}>Sigue construyendo tus hábitos, un día a la vez.</p>
      </div>
    </div>
  )
}

export default WelcomeSection

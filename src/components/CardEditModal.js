const Modal = ({
  children,
  visible,
  width,
  height,
  backgroundColor = Common.colors.background_modal,
  onClose,
  ...props
}: ModalProps) => {
  const ref = useClickAway(() => {
   onClose && onClose();
  });

  return (
    <Portal>
      <BackgroundDim style={{ display: visible ? 'block' : 'none' }}>
        <ModalContainer
          ref={ref}
          width={width}
          height={height}
          backgroundColor={backgroundColor}
          {...props}
        >
          {children}
        </ModalContainer>
      </BackgroundDim>
    </Portal>
  );
};